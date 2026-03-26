"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const glowSpring = { damping: 25, stiffness: 200, mass: 0.5 };
const maskSpring = { damping: 20, stiffness: 150, mass: 0.8 };

const MASK_SIZE = 150;

export default function CursorGlow() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const maskX = useMotionValue(-200);
  const maskY = useMotionValue(-200);

  const glowX = useSpring(mouseX, glowSpring);
  const glowY = useSpring(mouseY, glowSpring);
  const smoothMaskX = useSpring(maskX, maskSpring);
  const smoothMaskY = useSpring(maskY, maskSpring);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
      maskX.set(e.clientX - MASK_SIZE / 2);
      maskY.set(e.clientY - MASK_SIZE / 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, maskX, maskY]);

  return (
    <>
      {/* Ambient glow */}
      <motion.div
        className="fixed top-0 left-0 z-40 pointer-events-none w-[200px] h-[200px] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Mask reveal circle */}
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none rounded-full mix-blend-difference"
        style={{
          x: smoothMaskX,
          y: smoothMaskY,
          width: MASK_SIZE,
          height: MASK_SIZE,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)",
        }}
      />
    </>
  );
}
