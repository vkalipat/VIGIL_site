"use client";

import React, { useRef, useState, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverGlowButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function HoverGlowButton({ children, className, href }: HoverGlowButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <a
      ref={ref}
      href={href || "#"}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative overflow-hidden inline-flex items-center transition-all duration-300", className)}
    >
      <div
        className={cn(
          "absolute w-[200px] h-[200px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-300",
          hovered ? "scale-100" : "scale-0"
        )}
        style={{
          left: glowPos.x,
          top: glowPos.y,
          background: "radial-gradient(circle, rgba(0,212,170,0.3) 0%, transparent 70%)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </a>
  );
}
