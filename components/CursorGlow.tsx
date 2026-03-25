"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

const glowSpring = { damping: 25, stiffness: 200, mass: 0.5 };
const dotSpring = { damping: 20, stiffness: 400, mass: 0.2 };

export default function CursorGlow() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  const glowX = useSpring(mouseX, glowSpring);
  const glowY = useSpring(mouseY, glowSpring);
  const smoothDotX = useSpring(dotX, dotSpring);
  const smoothDotY = useSpring(dotY, dotSpring);

  const dotSize = useMotionValue(10);
  const smoothSize = useSpring(dotSize, { damping: 20, stiffness: 300 });
  const dotOpacity = useMotionValue(1);
  const smoothOpacity = useSpring(dotOpacity, { damping: 20, stiffness: 300 });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function handleMouseLeave() {
      setVisible(false);
    }

    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]")) {
        dotSize.set(40);
        dotOpacity.set(0.5);
      }
    }

    function handleMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]")) {
        dotSize.set(10);
        dotOpacity.set(1);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mouseX, mouseY, dotX, dotY, dotSize, dotOpacity, visible]);

  return (
    <>
      {/* Ambient glow */}
      <motion.div
        className="fixed top-0 left-0 z-40 pointer-events-none w-[200px] h-[200px] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Morphing dot cursor */}
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none rounded-full mix-blend-difference"
        style={{
          x: smoothDotX,
          y: smoothDotY,
          width: smoothSize,
          height: smoothSize,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? smoothOpacity : 0,
          backgroundColor: "#00D4AA",
        }}
      />
    </>
  );
}
