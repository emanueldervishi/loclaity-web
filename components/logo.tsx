import { Network } from "lucide-react";

export function Logo() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Network size={15} strokeWidth={2.2} />
      </span>
      Locality
    </span>
  );
}
