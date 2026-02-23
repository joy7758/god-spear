import fs from "node:fs";

export function runCheck(rulesPath) {
  const doc = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  // v0.1 只做 trust.crossings 最小集合
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

      // 一票否决：缺失 -> 直接 FAIL
      if (!c.failure_signal) {
        return failHard(`${prefix}: missing failure_signal`);
      }
      if (!c.revocation_pathway) {
        return failHard(`${prefix}: missing revocation_pathway`);
      }

      const g = Number(c.grace_period_ms);
      if (!Number.isFinite(g)) {
        return failHard(`${prefix}: grace_period_ms must be a number`);
      }
      if (g > 10) {
        return failHard(`${prefix}: grace_period_ms=${g} > 10`);
      }

      // v0.1 软扣分（示例）
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

  // v0.1：SRE = 风险 = 100-score（简单可解释、可复现）
  return {
    status,
    sre: 100 - score,
    score,
    findings,
    hard_fail: false
  };
}

function failHard(msg) {
  return {
    status: "FAIL",
    sre: 100,
    score: 0,
    findings: [
      { severity: "CRITICAL", code: "HARD_CONSTRAINT", msg }
    ],
    hard_fail: true
  };
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
