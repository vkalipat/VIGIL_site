"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#00D4AA]"
      style={{
        scaleX,
        boxShadow: "0 0 8px rgba(0,212,170,0.4), 0 0 2px rgba(0,212,170,0.6)",
      }}
    />
  );
}
