# Trust Gate Demo

Showing how a low-intrusion preflight gate can allow safe paths and block risky ones.

## Scenario

A runtime asks for file access before execution. The gate checks whether the request stays inside an approved workspace path and whether the action type is allowed by policy.

## Policy Input

The policy keeps the check small and removable. It focuses on a boundary check before execution rather than deep runtime instrumentation.

- [policy.example.json](../../examples/trust-gate/policy.example.json)
- [preflight-request.example.json](../../examples/trust-gate/preflight-request.example.json)

## Allowed Result

The allowed result shows a read request to an approved workspace document. The decision is explicit and references the policy rules that made the request acceptable.

- [allow-result.example.json](../../examples/trust-gate/allow-result.example.json)

## Denied Result

The denied result shows a request aimed outside the approved workspace path. The gate blocks it before execution and records the relevant policy references.

- [deny-result.example.json](../../examples/trust-gate/deny-result.example.json)

## Why this matters

This demo shows a removable, low-intrusion control layer for checking boundaries before execution. It is useful when teams want clear preflight decisions without changing the main runtime path more than necessary.
