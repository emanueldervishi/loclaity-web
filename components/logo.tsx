import Image from "next/image";

export function Logo() {
  return (
    <span className="brand">
      <span className="brand-logo-tile">
        <Image
          src="/logo.png"
          alt=""
          width={30}
          height={30}
          className="brand-logo-image"
          priority
        />
      </span>
      Locality
    </span>
  );
}
