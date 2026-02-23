#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf-8");
}

const rules = `{
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
`;

const workflow = `name: spear-check
on: [push, pull_request]
jobs:
  spear:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm i -g god-spear
      - run: spear check .spear-rules.json --out spear/reports
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: god-spear-report
          path: spear/reports
`;

const traceInit = ""; // empty file

writeFile(path.join(targetDir, ".spear-rules.json"), rules);
writeFile(path.join(targetDir, ".github/workflows/spear.yml"), workflow);
writeFile(path.join(targetDir, "spear/traces/trace.jsonl"), traceInit);

console.log("Created:");
console.log(" - .spear-rules.json");
console.log(" - .github/workflows/spear.yml");
console.log(" - spear/traces/trace.jsonl");
