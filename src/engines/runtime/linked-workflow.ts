import "server-only";

import type { JsonValue, ToolRecord } from "@/domain/types";
import { evaluateFormula } from "@/engines/formula";
import { executeAiRuntime } from "@/engines/runtime/ai";
import type { WorkflowContext } from "@/engines/runtime/context";
import { executeTextTransform } from "@/engines/runtime/text-transform";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { renderTemplate } from "@/lib/template";

interface WorkflowLinkRecord {
  workflow_id: string;
  sort_order: number;
}

interface WorkflowRecord {
  id: string;
  slug: string;
  is_active: boolean;
}

interface WorkflowStepRecord {
  id: string;
  workflow_id: string;
  step_key: string;
  name: string;
  step_type:
    | "template"
    | "formula"
    | "http_api"
    | "webhook"
    | "ai_text"
    | "ai_structured";
  sort_order: number;
  config: Record<string, unknown>;
  continue_on_error: boolean;
}

interface StepOutput {
  text?: string;
  data?: JsonValue;
}

export interface LinkedWorkflowResolution {
  id: string;
  slug: string;
}

export interface LinkedWorkflowRuntimeResult {
  text: string;
  data: JsonValue;
  providerCostSar: number;
  providerId?: string;
  modelId?: string;
  providerResponseId?: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}

function toJson(value: unknown): JsonValue {
  const serialized = JSON.stringify(value ?? null);
  return JSON.parse(serialized) as JsonValue;
}

async function recordStepStart(
  runId: string,
  stepId: string,
  context: WorkflowContext,
): Promise<string> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("workflow_step_runs")
    .insert({
      tool_run_id: runId,
      workflow_step_id: stepId,
      status: "running",
      input_snapshot: {
        input: context.input,
        available_steps: Object.keys(context.steps),
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return String(data.id);
}

async function finishStep(
  stepRunId: string,
  status: "completed" | "failed",
  output: StepOutput | null,
  errorMessage?: string,
): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("workflow_step_runs")
    .update({
      status,
      output_payload: output ?? null,
      error_message: errorMessage?.slice(0, 2000) ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", stepRunId);

  if (error) throw new Error(error.message);
}

export async function resolveLinkedWorkflow(
  toolId: string,
  requestedWorkflowSlug?: string,
): Promise<LinkedWorkflowResolution | null> {
  const supabase = createSupabaseAdminClient();

  const { data: linkData, error: linkError } = await supabase
    .from("workflow_tools")
    .select("workflow_id, sort_order")
    .eq("tool_id", toolId)
    .order("sort_order", { ascending: true })
    .limit(20);

  if (linkError) throw new Error(linkError.message);

  const links = (linkData ?? []) as WorkflowLinkRecord[];
  const requestedSlug = requestedWorkflowSlug?.trim();

  if (!links.length) {
    if (requestedSlug) {
      throw new Error("WORKFLOW_NOT_LINKED_TO_TOOL");
    }

    return null;
  }

  const workflowIds = [
    ...new Set(links.map((link) => String(link.workflow_id))),
  ];

  const { data: workflowData, error: workflowError } = await supabase
    .from("workflows")
    .select("id, slug, is_active")
    .in("id", workflowIds)
    .eq("is_active", true);

  if (workflowError) throw new Error(workflowError.message);

  const workflowsById = new Map(
    ((workflowData ?? []) as WorkflowRecord[]).map((workflow) => [
      String(workflow.id),
      workflow,
    ]),
  );

  const ordered = links
    .map((link) => workflowsById.get(String(link.workflow_id)))
    .filter((workflow): workflow is WorkflowRecord => Boolean(workflow))
    .map((workflow) => ({
      id: String(workflow.id),
      slug: String(workflow.slug),
    }));

  if (requestedSlug) {
    const requested = ordered.find(
      (workflow) => workflow.slug === requestedSlug,
    );

    if (!requested) {
      throw new Error("WORKFLOW_NOT_LINKED_TO_TOOL");
    }

    return requested;
  }

  return (
    ordered.find((workflow) => workflow.slug.endsWith("-quick")) ??
    ordered.find((workflow) => workflow.slug.endsWith("-standard")) ??
    ordered[0] ??
    null
  );
}

function passThrough(
  lastOutput: StepOutput | undefined,
  input: Record<string, unknown>,
): StepOutput {
  return lastOutput ?? {
    data: toJson(input),
  };
}

export async function executeLinkedWorkflowRuntime(
  tool: ToolRecord,
  workflowId: string,
  input: Record<string, unknown>,
  runId: string,
  maxOutputTokensLimit: number | null,
  localeCode: string,
): Promise<LinkedWorkflowRuntimeResult> {
  const supabase = createSupabaseAdminClient();

  const { data: link, error: linkError } = await supabase
    .from("workflow_tools")
    .select("workflow_id")
    .eq("tool_id", tool.id)
    .eq("workflow_id", workflowId)
    .maybeSingle();

  if (linkError) throw new Error(linkError.message);
  if (!link) throw new Error("WORKFLOW_NOT_LINKED_TO_TOOL");

  const { data: workflow, error: workflowError } = await supabase
    .from("workflows")
    .select("id, is_active")
    .eq("id", workflowId)
    .eq("is_active", true)
    .maybeSingle();

  if (workflowError) throw new Error(workflowError.message);
  if (!workflow) throw new Error("WORKFLOW_NOT_FOUND");

  const { data: stepData, error: stepError } = await supabase
    .from("workflow_steps")
    .select("*")
    .eq("workflow_id", workflowId)
    .order("sort_order", { ascending: true });

  if (stepError) throw new Error(stepError.message);

  const steps = (stepData ?? []) as WorkflowStepRecord[];

  if (!steps.length) {
    throw new Error("WORKFLOW_HAS_NO_STEPS");
  }

  if (steps.length > 30) {
    throw new Error("WORKFLOW_STEP_LIMIT_EXCEEDED");
  }

  const context: WorkflowContext = {
    input,
    steps: {},
  };

  let lastOutput: StepOutput | undefined;
  let sourceOutput: StepOutput | undefined;
  let aiExecuted = false;

  let providerCostSar = 0;
  let providerId: string | undefined;
  let modelId: string | undefined;
  let providerResponseId: string | undefined;
  let inputTokens = 0;
  let outputTokens = 0;
  let cachedInputTokens = 0;

  for (const step of steps) {
    const stepRunId = await recordStepStart(
      runId,
      step.id,
      context,
    );

    try {
      const originalType = String(
        step.config?.v6_original_step_type ?? "",
      ).trim();

      let output: StepOutput;

      if (originalType === "validation") {
        output = passThrough(lastOutput, input);
      } else if (originalType === "analysis") {
        output = passThrough(lastOutput, input);
      } else if (originalType === "prompt") {
        const prompt = renderTemplate(
          tool.prompt_template ?? "",
          input,
        );

        if (!prompt.trim()) {
          throw new Error("PROMPT_TEMPLATE_REQUIRED");
        }

        output = {
          text: prompt,
          data: {
            prompt,
          },
        };
      } else if (originalType === "formula") {
        const expression = String(
          tool.runtime_config.expression ?? "",
        );

        if (!expression.trim()) {
          throw new Error("FORMULA_EXPRESSION_REQUIRED");
        }

        const result = evaluateFormula(expression, input);

        output = {
          text: String(result),
          data: {
            result,
          },
        };

        sourceOutput = output;
      } else if (originalType === "text_transform") {
        const transformed = executeTextTransform(
          tool,
          input,
          localeCode,
        );

        output = transformed;
        sourceOutput = output;
      } else if (originalType === "ai") {
        if (aiExecuted && sourceOutput) {
          output = sourceOutput;
        } else {
          const prompt =
            context.steps.prompt?.text ??
            renderTemplate(
              tool.prompt_template ?? "",
              input,
            );

          if (!prompt.trim()) {
            throw new Error("PROMPT_TEMPLATE_REQUIRED");
          }

          const ai = await executeAiRuntime(
            tool,
            {
              model_alias:
                tool.model_alias ?? "standard",
              provider_strategy:
                tool.provider_strategy,
              max_output_tokens: Number(
                tool.runtime_config.max_output_tokens ??
                  2000,
              ),
              output_schema:
                tool.engine_type === "ai_structured"
                  ? tool.output_schema
                  : undefined,
            },
            prompt,
            maxOutputTokensLimit,
            runId,
            step.step_key,
          );

          providerCostSar += ai.providerCostSar;
          providerId = ai.providerId;
          modelId = ai.modelId;
          providerResponseId =
            ai.result.providerResponseId;
          inputTokens += ai.result.usage.inputTokens;
          outputTokens += ai.result.usage.outputTokens;
          cachedInputTokens +=
            ai.result.usage.cachedInputTokens ?? 0;

          output = {
            text: ai.result.text,
            data: ai.result.data,
          };

          sourceOutput = output;
          aiExecuted = true;
        }
      } else if (originalType === "transform") {
        output =
          sourceOutput ??
          passThrough(lastOutput, input);
      } else {
        throw new Error(
          `V6_WORKFLOW_STEP_UNSUPPORTED:${originalType || step.step_type}`,
        );
      }

      context.steps[step.step_key] = output;
      lastOutput = output;

      await finishStep(
        stepRunId,
        "completed",
        output,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "WORKFLOW_STEP_FAILED";

      await finishStep(
        stepRunId,
        "failed",
        null,
        message,
      );

      if (!step.continue_on_error) {
        throw error;
      }

      const errorOutput: StepOutput = {
        data: {
          error: message,
        },
      };

      context.steps[step.step_key] = errorOutput;
      lastOutput = errorOutput;
    }
  }

  const finalOutput =
    sourceOutput ??
    lastOutput ?? {
      data: null,
    };

  return {
    text: finalOutput.text ?? "",
    data:
      finalOutput.data ??
      ({
        text: finalOutput.text ?? "",
      } as JsonValue),
    providerCostSar,
    providerId,
    modelId,
    providerResponseId,
    inputTokens,
    outputTokens,
    cachedInputTokens,
  };
}
