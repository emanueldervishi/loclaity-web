import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LocalAiChat } from "@/components/local-ai-chat";
import { requireDashboardSetup } from "@/lib/dashboard-setup";

export const metadata = {
  title: "AI chat",
};

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
