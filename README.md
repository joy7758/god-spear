# God Spear (god-spear)

A minimal security gate for AI projects:
- **Spear-Core**: explicit trust-boundary rules with **hard fail-fast** checks
- **Spear-Trace**: tamper-evident **hash-chained** action trace (black-box logging)
- **Reports**: JSON + HTML, generated locally and in CI (artifact)

## Install

```bash
npm i -g god-spear
```

## Quick start (1 minute)

### 1) Add rules

Create `.spear-rules.json` in your repo root:

```json
{
  "trust": {
    "crossings": [
      {
        "id": "C1",
        "failure_signal": { "signal": "drift", "threshold": 0.05, "sampling_ms": 10 },
        "revocation_pathway": { "actions": ["revoke-token"], "evidence": ["logref:revocations"] },
        "grace_period_ms": 10,
        "authn": { "method": "mTLS" }
      }
    ]
  }
}
```

### 2) Run scan (local)

```bash
mkdir -p spear/traces
: > spear/traces/trace.jsonl

spear check .spear-rules.json --out spear/reports --trace spear/traces/trace.jsonl
open spear/reports/latest.html
```

### 3) Verify trace (tamper-evident)

```bash
spear trace verify spear/traces/trace.jsonl
```

## What counts as FAIL (hard constraints)

Any trust boundary crossing MUST declare:

* `failure_signal`
* `revocation_pathway`
* `grace_period_ms <= 10` (for local/edge enforcement)

If missing → **FAIL**.

## CI (GitHub Action)

Minimal workflow:

```yaml
name: spear-check
on: [push, pull_request]
jobs:
  spear:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm i -g god-spear || npm i -g .
      - run: spear check .spear-rules.json --out spear/reports
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: god-spear-report
          path: spear/reports
```

## Scaffold (optional)

```bash
create-pfdo-secure .
```

It generates:

* `.spear-rules.json`
* `.github/workflows/spear.yml`
* `spear/traces/trace.jsonl`

## License

MIT
