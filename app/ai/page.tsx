import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AI Chat",
  description:
    "Locality AI chat runs from your dashboard and uses imported project memory to answer coding questions.",
  path: "/ai",
  noIndex: true,
});

export default async function LocalAiPage() {
  redirect("/dashboard/chat");
}
