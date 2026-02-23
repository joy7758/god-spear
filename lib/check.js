import fs from "node:fs";

export function runCheck(rulesPath) {
  if (!fs.existsSync(rulesPath)) {
    return {
      status: "FAIL",
      sre: 100,
      score: 0,
      hard_fail: true,
      findings: [
        {
          severity: "CRITICAL",
          code: "RULES_NOT_FOUND",
          msg: `Rules file not found: ${rulesPath}. Create .spear-rules.json in repo root.`
        }
      ]
    };
  }

  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));
  } catch (e) {
    return {
      status: "FAIL",
      sre: 100,
      score: 0,
      hard_fail: true,
      findings: [
        {
          severity: "CRITICAL",
          code: "RULES_INVALID_JSON",
          msg: `Rules file is not valid JSON: ${rulesPath}`
        }
      ]
    };
  }

  const crossings = doc?.trust?.crossings ?? [];
  const findings = [];
  let score = 100;

  if (!Array.isArray(crossings) || crossings.length === 0) {
    findings.push({
      severity: "HIGH",
      code: "NO_CROSSINGS",
      msg: "trust.crossings must be non-empty"
    });
    score -= 30;
  } else {
    for (let i = 0; i < crossings.length; i++) {
      const c = crossings[i];
      const prefix = `crossings[${i}]`;

      // Hard constraint
      if (!c.failure_signal) return failHard(`${prefix}: missing failure_signal`);
      if (!c.revocation_pathway) return failHard(`${prefix}: missing revocation_pathway`);

      const g = Number(c.grace_period_ms);
      if (!Number.isFinite(g)) return failHard(`${prefix}: grace_period_ms must be a number`);
      if (g > 10) return failHard(`${prefix}: grace_period_ms=${g} > 10`);

      // Soft examples
      if (c.authn?.method === "none") {
        findings.push({
          severity: "MEDIUM",
          code: "WEAK_AUTHN",
          msg: `${prefix}: authn.method=none`
        });
        score -= 10;
      }
    }
  }

  score = clamp(score, 0, 100);
  const status = score >= 80 ? "PASS" : score >= 60 ? "WARN" : "FAIL";

  return { status, sre: 100 - score, score, findings, hard_fail: false };
}

function failHard(msg) {
  return {
    status: "FAIL",
    sre: 100,
    score: 0,
    hard_fail: true,
    findings: [{ severity: "CRITICAL", code: "HARD_CONSTRAINT", msg }]
  };
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
