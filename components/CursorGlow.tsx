"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };

export default function CursorGlow() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-40 pointer-events-none w-[200px] h-[200px] rounded-full"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)",
      }}
    />
  );
}
