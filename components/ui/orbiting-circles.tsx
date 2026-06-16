import { Children, type ReactNode } from "react";

type OrbitingCirclesProps = {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  size?: "inner" | "outer";
};

export function OrbitingCircles({
  children,
  className = "",
  reverse = false,
  size = "outer",
}: OrbitingCirclesProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "magic-orbit",
        `magic-orbit-${size}`,
        reverse ? "magic-orbit-reverse" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {Children.toArray(children).map((child, index) => (
        <div className={`magic-orbit-position orbit-position-${index + 1}`} key={index}>
          <div className="magic-orbit-content">{child}</div>
        </div>
      ))}
    </div>
  );
}
