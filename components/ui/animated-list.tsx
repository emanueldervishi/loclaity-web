"use client";

import { Children, type ReactNode, useEffect, useState } from "react";

type AnimatedListProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedList({
  children,
  className = "",
  delay = 650,
}: AnimatedListProps) {
  const items = Children.toArray(children);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (items.length < 2) return;

    const timer = window.setInterval(() => {
      setVisibleCount((current) => current >= items.length ? 1 : current + 1);
    }, delay);

    return () => window.clearInterval(timer);
  }, [delay, items.length]);

  return (
    <div className={`magic-animated-list ${className}`.trim()}>
      {items.slice(0, visibleCount).map((item, index) => (
        <div className="magic-animated-list-item" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}
