# V6-00.5 — Live AI Workflow Verification

## Result

**PASS**

Live AI execution was verified against the linked Gemini provider using:

- Model: `gemini-3.5-flash-lite`
- Model alias: `standard`
- Tool: `x-post-generator`
- Test user wallet: `300 → 290`
- Total credits charged: `10`

## Quick Workflow

- Workflow: `workflow-x-post-generator-quick`
- Run ID: `6ce25ecc-c504-456d-affa-6afe85834aec`
- HTTP status: `200`
- Run status: `completed`
- Completed steps: `4 / 4`
- Input tokens: `308`
- Output tokens: `339`
- Total tokens: `647`
- Reserved credits: `10`
- Charged credits: `5`
- Provider estimated cost: `$0.0009399`

## Professional Workflow

- Workflow: `workflow-x-post-generator-professional`
- Run ID: `0e74c89d-7f37-4a27-bf10-55eab652d282`
- HTTP status: `200`
- Run status: `completed`
- Completed steps: `6 / 6`
- Input tokens: `308`
- Output tokens: `250`
- Total tokens: `558`
- Reserved credits: `10`
- Charged credits: `5`
- Provider estimated cost: `$0.0007174`

## Totals

- Input tokens: `616`
- Output tokens: `589`
- Total tokens: `1,205`
- Estimated provider cost: `$0.0016573`
- Reserved credits: `20`
- Charged credits: `10`
- Wallet delta: `10`
- Credit reconciliation: `PASS`

## Database Verification

Verified records were created in:

- `tool_runs`
- `workflow_step_runs`
- `provider_usage`
- `credit_reservations`
- `credit_transactions`

Both credit reservations reached the `settled` state.

## Model Migration

- `gemini-2.5-flash`: disabled
- `gemini-3.5-flash-lite`: enabled
- Active alias: `standard`
- Max output tokens: `65536`

## Final Status

`V6-00.5 LIVE AI VERIFICATION: PASS`
