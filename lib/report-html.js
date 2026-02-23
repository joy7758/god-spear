import fs from "node:fs";
import path from "node:path";

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function badge(status) {
  const text = esc(status);
  // 不指定颜色（你之前的要求是不要固定颜色风格；这里用最朴素的文字块）
  return `<span style="padding:2px 8px;border:1px solid #999;border-radius:999px;font-family:ui-monospace,Menlo,monospace;">${text}</span>`;
}

export function writeHtmlReport({ outPath, meta, report }) {
  const findingsRows = report.findings.map(f => {
    return `<tr>
      <td style="border-bottom:1px solid #ddd;padding:8px;">${esc(f.severity)}</td>
      <td style="border-bottom:1px solid #ddd;padding:8px;">${esc(f.code)}</td>
      <td style="border-bottom:1px solid #ddd;padding:8px;">${esc(f.msg)}</td>
    </tr>`;
  }).join("\n");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>God Spear Report</title>
</head>
<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 24px;">
  <h1 style="margin:0 0 8px 0;">God Spear Security Report</h1>
  <div style="margin:0 0 16px 0;color:#444;">
    Generated at: ${esc(report.generated_at)}
  </div>

  <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;margin: 0 0 20px 0;">
    <div style="min-width:220px;">
      <div style="font-size:14px;color:#666;">STATUS</div>
      <div style="font-size:22px;">${badge(report.summary.status)}</div>
    </div>
    <div style="min-width:220px;">
      <div style="font-size:14px;color:#666;">SRE (0 best → 100 worst)</div>
      <div style="font-size:22px;">${esc(report.summary.sre)}</div>
    </div>
    <div style="min-width:220px;">
      <div style="font-size:14px;color:#666;">FINDINGS</div>
      <div style="font-size:22px;">${esc(report.summary.findings_count)}</div>
    </div>
  </div>

  <h2 style="margin: 0 0 10px 0;">Executive Summary</h2>
  <div style="border:1px solid #ddd;border-radius:12px;padding:12px;margin-bottom:18px;">
    <p style="margin:0 0 10px 0;">
      This scan validates whether every trust boundary crossing explicitly declares:
      <b>failure_signal</b>, <b>revocation_pathway</b>, and <b>grace_period_ms ≤ 10</b>.
    </p>
    <p style="margin:0;">
      Recommendation: if status is not PASS, add missing declarations and re-run the scan until SRE decreases.
    </p>
  </div>

  <h2 style="margin: 0 0 10px 0;">Findings</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <thead>
      <tr>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px;">Severity</th>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px;">Code</th>
        <th style="text-align:left;border-bottom:1px solid #ddd;padding:8px;">Message</th>
      </tr>
    </thead>
    <tbody>
      ${findingsRows || `<tr><td colspan="3" style="padding:8px;">No findings.</td></tr>`}
    </tbody>
  </table>

  <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
  <div style="color:#777;font-size:12px;">
    Project: ${esc(meta?.project ?? "unknown")} · Rules: ${esc(meta?.rules ?? ".spear-rules.json")}
  </div>
</body>
</html>`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf-8");
}
