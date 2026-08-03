# V6-00.7 — Production Observability Baseline

## Stage

Production monitoring, runtime reliability, provider usage, credit reconciliation, and administrative observability.

## Starting Point

- Previous completed stage: V6-00.5
- Previous valid commit: 329814f
- AI model: gemini-3.5-flash-lite
- Live AI workflows: verified
- AdSense: waiting for Google site review

## Production Smoke Test

The following production routes returned HTTP 200:

- /
- /ar
- /ar/tools
- /ar/pricing
- /robots.txt
- /sitemap.xml
- /ads.txt

## Planned Deliverables

- `/api/health`
- `/admin/observability`
- Production smoke checks
- Tool run success and failure metrics
- Provider usage and token metrics
- Credit reservation and settlement metrics
- Safe structured error reporting
- Verification report

## Security Constraints

- Never expose provider secrets.
- Never expose service-role credentials.
- Health responses must contain status metadata only.
- User inputs and generated outputs must not appear in public health responses.
