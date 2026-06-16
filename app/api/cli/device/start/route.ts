import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken, randomToken, userCode } from "@/lib/security";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const deviceName = String(payload.device_name || payload.deviceName || "Locality CLI").slice(0, 80);
  const deviceCode = randomToken(40);
  const code = userCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.deviceCode.create({
    data: {
      deviceHash: hashToken(deviceCode),
      userCode: code,
      deviceName,
      expiresAt
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return NextResponse.json({
    device_code: deviceCode,
    user_code: code,
    verification_uri: `${baseUrl}/activate`,
    verification_uri_complete: `${baseUrl}/activate?code=${encodeURIComponent(code)}`,
    expires_in: 600,
    interval: 3
  });
}
