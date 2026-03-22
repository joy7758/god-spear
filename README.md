<!-- language-switch:start -->
<p>
  <a href="./README.md">
    <img src="https://img.shields.io/badge/English-Current-1f883d?style=for-the-badge" alt="English">
  </a>
  <a href="./README.zh-CN.md">
    <img src="https://img.shields.io/badge/Chinese-Switch-0f172a?style=for-the-badge" alt="Chinese">
  </a>
</p>
<!-- language-switch:end -->

<p align="center">
  <img src="assets/logo.svg" width="380"/>
</p>

<p align="center">

![npm](https://img.shields.io/npm/v/god-spear)
![node](https://img.shields.io/node/v/god-spear)
![license](https://img.shields.io/npm/l/god-spear)
![downloads](https://img.shields.io/npm/dm/god-spear)
![build](https://img.shields.io/github/actions/workflow/status/joy7758/god-spear/release.yml?label=release)

</p>

# God Spear

*Trust gates for tools, files, and runtime environments.*

Part of the Agent Runtime Safety Kit, alongside Token Governor and ARO Audit.  
This repo focuses on trust gates, boundary checks, and preflight safety validation.

<p align="center">
  <b>Explicit Trust Boundaries · Deterministic Failure · Immutable Trace</b>
</p>

`god-spear` is a CI-native security gate that blocks risky AI automation unless trust boundaries, deterministic rollback, and failure signals are explicitly defined.

---

## Role in the Kit

- Checks trust boundaries before execution.
- Supports preflight validation for risky paths.
- Useful for tools, files, env, CI, and runtime entry points.
- Complements budget governance and execution receipts.
- Designed as a removable, low-intrusion control layer.

## Related Projects

- [Token Governor](https://github.com/joy7758/token-governor)
- [ARO Audit](https://github.com/joy7758/aro-audit)
- [Agent Runtime Safety Kit Overview](https://github.com/joy7758/token-governor/blob/main/docs/agent-runtime-safety-kit.md)

## External Adapter

For a minimal MCP-style preflight integration example, see:
https://github.com/joy7758/god-spear-mcp-gate

This adapter shows a low-intrusion trust gate pattern in front of tool execution.

- [ARO Audit LangChain Receipt](https://github.com/joy7758/aro-audit-langchain-receipt)

This can sit after execution, while God Spear MCP Gate handles a preflight trust check before tool execution.

## Quick Demo

- This repo checks trust boundaries before execution.
- See the trust gate demo and example preflight results below.
- It is designed to complement Token Governor and ARO Audit.

## Demo Assets

- [Trust Gate Demo](docs/demos/trust-gate-demo.md)
- [Policy Example](examples/trust-gate/policy.example.json)
- [Preflight Request Example](examples/trust-gate/preflight-request.example.json)
- [Allow Result Example](examples/trust-gate/allow-result.example.json)
- [Deny Result Example](examples/trust-gate/deny-result.example.json)

---

## What is god-spear?

- **Adoption evidence:** see [ADOPTION.md](ADOPTION.md)


`god-spear` is a minimal security gate for AI agents and automation systems.

It enforces:

- Explicit trust-boundary declarations
- One-vote veto on missing revocation logic
- Deterministic failure signaling
- Optional immutable trace chain (Spear-Trace)

Zero runtime dependency.  
CI-native.  
Fully removable.

---

## Security Model

god-spear introduces three enforceable primitives:

1. **Failure Signal**
   Every boundary crossing must define an observable and thresholded failure signal.

2. **Revocation Pathway**
   Every execution path must define deterministic rollback logic.

3. **Grace Budget (ms)**
   Post-failure revocation latency constraint for local/edge safety budgets.

If any primitive is missing → `FAIL`.

---

## Installation

```bash
npm i -g god-spear
```

---

## Usage

```bash
spear check .spear-rules.json
```

Returns:

- `PASS`
- `FAIL`

---

## Supply Chain Integrity

- Provenance-enabled npm publish (`--provenance`)
- SBOM generated at release
- Version pinned in CI
- Deterministic file whitelist
- No dynamic install scripts

---

## License

MIT
