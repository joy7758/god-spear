export function toTextReport(result) {
  const lines = [];
  lines.push(`STATUS: ${result.status}`);
  lines.push(`SRE: ${result.sre} (0=best, 100=worst)`);
  lines.push(`SCORE: ${result.score}`);
  lines.push(`FINDINGS: ${result.findings.length}`);

  for (const f of result.findings) {
    lines.push(`- [${f.severity}] ${f.code}: ${f.msg}`);
  }

  // v0.1 给一句“董事会语言”
  if (result.status !== "PASS") {
    lines.push("");
    lines.push("RECOMMENDATION:");
    lines.push("- Declare failure_signal + revocation_pathway for every trust crossing.");
    lines.push("- Ensure grace_period_ms <= 10 for L1 edge / local enforcement.");
  }

  return lines.join("\n");
}
