import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function getLastHash(tracePath) {
  if (!fs.existsSync(tracePath)) return "GENESIS";
  const lines = fs.readFileSync(tracePath, "utf-8").split("\n").filter(Boolean);
  if (lines.length === 0) return "GENESIS";
  const last = JSON.parse(lines[lines.length - 1]);
  return last.hash || "GENESIS";
}

export function appendTrace({ tracePath, eventType, actor, payload }) {
  const prevHash = getLastHash(tracePath);
  const ts = new Date().toISOString();

  // v0.1: payload 不落明文敏感信息，建议写摘要或引用
  const payloadJson = JSON.stringify(payload ?? {});
  const payloadHash = sha256(payloadJson);

  const record = {
    ts,
    event_type: eventType,
    actor: actor ?? "unknown",
    payload_hash: payloadHash,
    prev_hash: prevHash
  };

  // v0.1 canonical：JSON.stringify(record)
  const canon = JSON.stringify(record);
  record.hash = sha256(canon);

  fs.mkdirSync(path.dirname(tracePath), { recursive: true });
  fs.appendFileSync(tracePath, JSON.stringify(record) + "\n", "utf-8");

  return record;
}

export function verifyTrace(tracePath) {
  if (!fs.existsSync(tracePath)) {
    return { ok: false, error: `trace file not found: ${tracePath}` };
  }

  const lines = fs.readFileSync(tracePath, "utf-8").split("\n").filter(Boolean);
  let prev = "GENESIS";

  for (let i = 0; i < lines.length; i++) {
    const rec = JSON.parse(lines[i]);

    if (rec.prev_hash !== prev) {
      return { ok: false, index: i, error: "prev_hash mismatch" };
    }

    const { hash, ...rest } = rec;
    const canon = JSON.stringify(rest);
    const expected = sha256(canon);

    if (hash !== expected) {
      return { ok: false, index: i, error: "hash mismatch" };
    }

    prev = hash;
  }

  return { ok: true, count: lines.length };
}
