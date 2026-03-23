"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export default function CTA() {
  return (
    <section className="py-24 md:py-32 px-6 relative">
      {/* Top rule — thin, static, clinical */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-white/[0.08]" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-3xl mx-auto"
      >
        {/* Lead stat — stark, typographic */}
        <motion.p
          variants={item}
          className="text-sm font-medium tracking-wide text-zinc-600 uppercase"
        >
          The monitoring gap
        </motion.p>

        <motion.p
          variants={item}
          className="text-6xl md:text-8xl font-bold leading-none tracking-tighter tabular-nums text-[#FAFAFA] mt-4"
        >
          87–97%
        </motion.p>

        <motion.p
          variants={item}
          className="text-lg md:text-xl leading-relaxed text-zinc-400 mt-4 max-w-xl"
        >
          of general ward patient time is unmonitored. Vital signs are checked
          every 4–8 hours. Deterioration happens in minutes.
        </motion.p>

        <motion.p
          variants={item}
          className="text-sm text-zinc-600 mt-2"
        >
          Cardona-Morrell et al., <span className="italic">Resuscitation</span>, 2016
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={item}
          className="w-12 h-px bg-white/[0.15] mt-12 mb-12"
        />

        {/* Headline */}
        <motion.h2
          variants={item}
          className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]"
        >
          Every 4 hours is not enough.
        </motion.h2>

        <motion.p
          variants={item}
          className="text-lg md:text-xl leading-relaxed text-zinc-400 mt-6 max-w-xl"
        >
          VIGIL equips a 40-bed ward for under $2,000 — less than a single
          bedside monitor.
        </motion.p>

        {/* CTAs — institutional, restrained */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-start gap-4 mt-10"
        >
          <Link
            href="/team#contact"
            className="bg-[#00D4AA] text-[#0A0A0F] font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all inline-flex items-center"
          >
            Request a Pilot
          </Link>
          <Link
            href="/workflow"
            className="border border-white/[0.15] text-[#FAFAFA] px-8 py-3 rounded-lg hover:bg-white/[0.05] transition-all inline-flex items-center"
          >
            Read the Paper
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-white/[0.08]" />
    </section>
  );
}
