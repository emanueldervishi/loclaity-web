"use client";

import { useEffect, useRef } from "react";

type FlickeringGridProps = {
  className?: string;
  color?: string;
  flickerChance?: number;
  gridGap?: number;
  maxOpacity?: number;
  squareSize?: number;
};

export function FlickeringGrid({
  className = "",
  color = "9, 168, 238",
  flickerChance = 0.12,
  gridGap = 6,
  maxOpacity = 0.28,
  squareSize = 3,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return;

    let animationFrame = 0;
    let columns = 0;
    let rows = 0;
    let opacity = new Float32Array();
    let visible = true;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Math.ceil(width / (squareSize + gridGap));
      rows = Math.ceil(height / (squareSize + gridGap));
      opacity = Float32Array.from(
        { length: columns * rows },
        () => Math.random() * maxOpacity,
      );
    };

    const draw = () => {
      if (visible) {
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        for (let index = 0; index < opacity.length; index += 1) {
          if (Math.random() < flickerChance) {
            opacity[index] = Math.random() * maxOpacity;
          }
          const x = (index % columns) * (squareSize + gridGap);
          const y = Math.floor(index / columns) * (squareSize + gridGap);
          context.fillStyle = `rgba(${color}, ${opacity[index]})`;
          context.fillRect(x, y, squareSize, squareSize);
        }
      }
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    resizeObserver.observe(container);
    visibilityObserver.observe(container);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [color, flickerChance, gridGap, maxOpacity, squareSize]);

  return (
    <canvas
      aria-hidden="true"
      className={`magic-flickering-grid ${className}`.trim()}
      ref={canvasRef}
    />
  );
}
