"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const imgSize = size === "large" ? 120 : 90;

  return (
    <Link href="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
      <Image
        src="/images/vigil-icon.png"
        alt="Vigil logo"
        width={imgSize}
        height={imgSize}
        className="shrink-0 object-contain"
        priority
      />
    </Link>
  );
}
