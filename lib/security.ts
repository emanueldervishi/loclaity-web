import { createHash, randomBytes } from "crypto";

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function userCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";

  for (let index = 0; index < 8; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return `${value.slice(0, 4)}-${value.slice(4)}`;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}
