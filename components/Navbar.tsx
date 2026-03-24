"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { HoverGlowButton } from "@/components/ui/hover-glow-button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workflow", label: "Workflow" },
  { href: "/team", label: "Team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const lastScrollY = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY[0];
    setScrolled(latest > 20);
    // Hide navbar when scrolling down past 100px, show when scrolling up
    if (latest > 100 && latest > prev) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY[0] = latest;
  });

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0A0A0F]"
      >

        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-8">
            {/* Desktop nav links */}
            <div className="hidden sm:flex items-center gap-1 relative">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "text-[#FAFAFA]"
                        : "text-zinc-400 hover:text-[#FAFAFA]"
                    }`}
                  >
                    {/* Animated pill background for active state */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        {/* Lamp glow above the tab */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#00D4AA] rounded-t-full">
                          <div className="absolute w-12 h-6 bg-[#00D4AA]/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-[#00D4AA]/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-[#00D4AA]/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.span>
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* CTA button with shimmer */}
            <HoverGlowButton
              href="/team#contact"
              className="hidden sm:inline-flex items-center relative overflow-hidden bg-[#00D4AA] text-[#0A0A0F] font-semibold px-6 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:brightness-110 transition-all duration-300 text-sm"
            >
              <span className="relative z-10">Request a Pilot</span>
              <motion.span
                className="absolute inset-0 z-0"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: ["−100%", "200%"], opacity: [0, 0.4, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 2.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="block h-full w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]" />
              </motion.span>
            </HoverGlowButton>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-[#FAFAFA]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-[#FAFAFA]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 sm:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#0A0A0F]/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-20 mx-6 rounded-2xl bg-[#111118]/95 backdrop-blur-2xl border border-white/[0.08] p-6"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-300 ${
                          isActive
                            ? "bg-white/[0.06] text-[#00D4AA] border border-white/[0.08]"
                            : "text-zinc-400 hover:text-[#FAFAFA] hover:bg-white/[0.03]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 pt-4 border-t border-white/[0.06]"
              >
                <Link
                  href="/team#contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-[#00D4AA] text-[#0A0A0F] font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  Request a Pilot
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
