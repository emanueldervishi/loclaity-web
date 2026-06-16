"use client";

import { type RefObject, useEffect, useId, useState } from "react";

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
};

type BeamGeometry = {
  height: number;
  path: string;
  width: number;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
}: AnimatedBeamProps) {
  const gradientId = useId().replaceAll(":", "");
  const [geometry, setGeometry] = useState<BeamGeometry>({
    height: 0,
    path: "",
    width: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;
      const controlX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2 + curvature;

      setGeometry({
        width: containerRect.width,
        height: containerRect.height,
        path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);

    return () => observer.disconnect();
  }, [containerRef, curvature, fromRef, toRef]);

  if (!geometry.path) return null;

  return (
    <svg
      aria-hidden="true"
      className={reverse ? "magic-beam magic-beam-reverse" : "magic-beam"}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#09a8ee" stopOpacity="0" />
          <stop offset="45%" stopColor="#09a8ee" />
          <stop offset="65%" stopColor="#50d8ff" />
          <stop offset="100%" stopColor="#50d8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="magic-beam-track" d={geometry.path} />
      <path
        className="magic-beam-flow"
        d={geometry.path}
        pathLength="100"
        stroke={`url(#${gradientId})`}
      />
    </svg>
  );
}
