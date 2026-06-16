import { redirect } from "next/navigation";

export const metadata = {
  title: "AI Chat"
};

export default async function LocalAiPage() {
  redirect("/dashboard/chat");
}
