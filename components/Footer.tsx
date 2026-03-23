"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const footerLinks = [
  { href: "/workflow", label: "Workflow" },
  { href: "/team", label: "Team" },
  { href: "/team#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/[0.08]">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#00D4AA]/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm text-zinc-600 max-w-xs text-center md:text-left">
              Continuous ICU-grade monitoring for hospital general wards.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-zinc-400 hover:text-[#FAFAFA] transition-colors duration-300"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#00D4AA] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} VIGIL. Open hardware under CERN
            OHL v2.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00D4AA]/40">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#00D4AA]"
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]" />
            </span>
            <span className="text-xs text-zinc-500">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
