#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { appendTrace, verifyTrace } from "../lib/trace.js";
import { runCheck } from "../lib/check.js";
import { toTextReport } from "../lib/report.js";
import { writeJsonReport } from "../lib/report-json.js";
import { writeHtmlReport } from "../lib/report-html.js";

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage:
  spear trace append <tracePath> <eventType> <actor> [payloadJsonFile]
  spear trace verify <tracePath>

  spear check [rulesPath] [--trace <tracePath>] [--out <dir>]
    - default rulesPath: .spear-rules.json
    - default out dir: spear/reports
`);
}

if (args.length === 0) {
  usage();
  process.exit(1);
}

const [cmd, sub, ...rest] = args;

if (cmd === "trace" && sub === "append") {
  const [tracePath, eventType, actor, payloadFile] = rest;
  const payload = payloadFile ? JSON.parse(fs.readFileSync(payloadFile, "utf-8")) : {};
  const rec = appendTrace({ tracePath, eventType, actor, payload });
  console.log(JSON.stringify(rec, null, 2));
  process.exit(0);
}

if (cmd === "trace" && sub === "verify") {
  const [tracePath] = rest;
  const res = verifyTrace(tracePath);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.ok ? 0 : 2);
}

if (cmd === "check") {
  const rulesPath = (sub && !sub.startsWith("--")) ? sub : ".spear-rules.json";

  const traceIdx = rest.indexOf("--trace");
  const tracePath = traceIdx >= 0 ? rest[traceIdx + 1] : null;

  const outIdx = rest.indexOf("--out");
  const outDir = outIdx >= 0 ? rest[outIdx + 1] : "spear/reports";

  const result = runCheck(rulesPath);

  // console output (human)
  console.log(toTextReport(result));

  // reports
  const meta = { project: path.basename(process.cwd()), rules: rulesPath };
  const jsonOut = path.join(outDir, "latest.json");
  const report = writeJsonReport({ outPath: jsonOut, meta, result });

  const htmlOut = path.join(outDir, "latest.html");
  writeHtmlReport({ outPath: htmlOut, meta, report });

  // trace
  if (tracePath) {
    appendTrace({
      tracePath,
      eventType: "spear_scan_result",
      actor: "spear-cli",
      payload: {
        rulesPath,
        report: { json: jsonOut, html: htmlOut },
        result_summary: {
          status: result.status,
          sre: result.sre,
          findings: result.findings.length,
          hard_fail: result.hard_fail
        }
      }
    });
  }

  process.exit(result.status === "PASS" ? 0 : 2);
}

usage();
process.exit(1);
