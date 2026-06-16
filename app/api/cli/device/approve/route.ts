import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  const form = await request.formData();
  const code = String(form.get("code") || "").trim().toUpperCase();
  const device = await prisma.deviceCode.findUnique({ where: { userCode: code } });

  if (
    !device ||
    device.status !== "PENDING" ||
    device.expiresAt.getTime() <= Date.now()
  ) {
    return NextResponse.redirect(
      new URL(`/activate?code=${encodeURIComponent(code)}&error=Invalid+or+expired+code`, request.url),
      303
    );
  }

  await prisma.deviceCode.update({
    where: { id: device.id },
    data: {
      status: "APPROVED",
      userId: session.user.id,
      approvedAt: new Date()
    }
  });

  return NextResponse.redirect(
    new URL(`/activate?code=${encodeURIComponent(code)}&approved=1`, request.url),
    303
  );
}
