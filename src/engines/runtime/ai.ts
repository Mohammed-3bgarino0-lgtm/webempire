import "server-only";

import type {
  AiExecutionResult,
  JsonValue,
  ToolRecord,
} from "@/domain/types";

export interface AiRuntimeConfig {
  model_alias?: string;
  provider_strategy?: ToolRecord["provider_strategy"];
  max_output_tokens?: number;
  prompt_template?: string;
  output_schema?: JsonValue;
}

export interface AiRuntimeStepResult {
  result: AiExecutionResult;
  providerId: string;
  modelId: string;
  providerCostSar: number;
}

/**
 * AI execution is intentionally disabled for Web Empire.
 *
 * Historical AI engine types and migrations remain in the repository so old
 * data can still be understood and rolled back safely, but no runtime path is
 * allowed to contact an AI provider. Formula, text-transform, HTTP, webhook,
 * workflow, and custom non-AI tooling can continue to use the shared runtime.
 */
export async function executeAiRuntime(
  _tool: ToolRecord,
  _config: AiRuntimeConfig,
  _prompt: string,
  _maxOutputTokensLimit: number | null,
  _runId: string,
  _stepKey?: string,
): Promise<AiRuntimeStepResult> {
  throw new Error("AI_TOOLING_DISABLED");
}
