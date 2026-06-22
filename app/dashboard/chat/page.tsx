import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LocalAiChat } from "@/components/local-ai-chat";
import { requireDashboardSetup } from "@/lib/dashboard-setup";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AI chat",
  description:
    "Ask Locality about imported sessions, commands, diffs, and debugging context from your private project memory.",
  path: "/dashboard/chat",
  noIndex: true,
});

export default async function DashboardChatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await requireDashboardSetup(session.user.id);

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <LocalAiChat />
    </div>
  );
}
