import { BrandLogo } from "@/components/brand-logo";

export function Logo() {
  return (
    <span className="brand" aria-label="Locality">
      <BrandLogo className="h-7 text-foreground" />
    </span>
  );
}
