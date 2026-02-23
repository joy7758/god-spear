import fs from "node:fs";
import path from "node:path";

export function writeJsonReport({ outPath, meta, result }) {
  const report = {
    spec: "god-spear-report",
    version: "0.1",
    generated_at: new Date().toISOString(),
    meta: meta ?? {},
    summary: {
      status: result.status,
      sre: result.sre,
      score: result.score,
      hard_fail: !!result.hard_fail,
      findings_count: result.findings.length
    },
    findings: result.findings
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");
  return report;
}
