import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";

const planLimits = {
  FREE: {
    max_chats: 10,
    max_turns_per_chat: 50,
    agents: ["codex"],
    automatic_imports: false
  },
  GO: {
    max_chats: null,
    max_turns_per_chat: null,
    agents: ["codex", "claude-code", "cursor", "copilot"],
    automatic_imports: true
  },
  PLUS: {
    max_chats: null,
    max_turns_per_chat: null,
    agents: ["codex", "claude-code", "cursor", "copilot", "gemini-cli"],
    automatic_imports: true
  }
} as const;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiToken = await prisma.apiToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true }
  });

  if (
    !apiToken ||
    apiToken.revokedAt ||
    (apiToken.expiresAt && apiToken.expiresAt.getTime() <= Date.now())
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await prisma.apiToken.update({
    where: { id: apiToken.id },
    data: { lastUsedAt: new Date() }
  });

  return NextResponse.json({
    user: {
      id: apiToken.user.id,
      name: apiToken.user.name,
      email: apiToken.user.email
    },
    plan: apiToken.user.plan.toLowerCase(),
    subscription_status: apiToken.user.subscriptionStatus,
    limits: planLimits[apiToken.user.plan]
  });
}
