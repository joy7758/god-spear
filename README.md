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

<p align="center">
  <b>Explicit Trust Boundaries · Deterministic Failure · Immutable Trace</b>
</p>

`god-spear` is a CI-native security gate that blocks risky AI automation unless trust boundaries, deterministic rollback, and failure signals are explicitly defined.

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
