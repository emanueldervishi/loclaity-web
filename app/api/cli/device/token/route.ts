import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken, randomToken } from "@/lib/security";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const deviceCode = String(payload.device_code || "");

  if (!deviceCode) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const device = await prisma.deviceCode.findUnique({
    where: { deviceHash: hashToken(deviceCode) }
  });

  if (!device || device.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "expired_token" }, { status: 400 });
  }

  if (device.status === "PENDING") {
    return NextResponse.json({ error: "authorization_pending" }, { status: 428 });
  }

  if (device.status !== "APPROVED" || !device.userId) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }

  const plainToken = `loc_${randomToken(36)}`;
  const issued = await prisma.$transaction(async (transaction) => {
    const claimed = await transaction.deviceCode.updateMany({
      where: {
        id: device.id,
        status: "APPROVED"
      },
      data: {
        status: "CONSUMED"
      }
    });

    if (claimed.count !== 1) return false;

    await transaction.apiToken.create({
      data: {
        tokenHash: hashToken(plainToken),
        name: device.deviceName,
        userId: device.userId as string
      }
    });

    return true;
  });

  if (!issued) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }

  return NextResponse.json({
    access_token: plainToken,
    token_type: "Bearer"
  });
}
