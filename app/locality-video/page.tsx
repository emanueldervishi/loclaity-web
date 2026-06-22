import type { Metadata } from "next";
import { LocalityMotionVideo } from "@/components/video/LocalityMotionVideo";
import "./locality-video.css";

export const metadata: Metadata = {
  title: "Locality — Your local AI memory layer",
  description: "A cinematic product film for Locality, the local-first AI workspace.",
};

export default async function LocalityVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ clean?: string; t?: string }>;
}) {
  const { clean, t } = await searchParams;
  const requestedStart = Number(t ?? 0);
  const startAt = Number.isFinite(requestedStart) ? Math.max(0, Math.min(requestedStart, 27.9)) * 1000 : 0;
  return <LocalityMotionVideo clean={clean === "true"} startAt={startAt} />;
}
