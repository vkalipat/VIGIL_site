"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const pilotIncludes = [
  "10 VIGIL units configured for your ward layout",
  "On-site clinical engineering training (2 hours)",
  "90-day technical support with dedicated contact",
  "Integration guidance for existing EHR/nurse-call systems",
  "Post-pilot data summary and ROI analysis",
];

const qualifyingCriteria = [
  "General or step-down ward with 20+ beds",
  "Nursing staff ratio of 1:6 or higher",
  "Existing Wi-Fi infrastructure (WPA2-Enterprise)",
  "Clinical champion willing to oversee pilot",
];

const targetMarkets = [
  "NHS Trusts",
  "VA Medical Centers",
  "Community Hospitals",
  "Academic Medical Centers",
  "Rural Critical Access",
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase">
            Clinical Partnerships
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            Start a Pilot Program
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
            We work directly with hospital administrators, clinical engineers,
            and procurement teams to deploy VIGIL in qualifying facilities.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        >
          {/* Left column — pilot details */}
          <div className="space-y-6">
            {/* What the pilot includes */}
            <motion.div
              variants={item}
              className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00D4AA]/10">
                  <Building2 className="w-5 h-5 text-[#00D4AA]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFAFA]">
                  What the Pilot Includes
                </h3>
              </div>
              <ul className="space-y-3">
                {pilotIncludes.map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 shrink-0" />
                    <span className="text-sm leading-relaxed text-zinc-400">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Qualifying criteria */}
            <motion.div
              variants={item}
              className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">
                Qualifying Criteria
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Pilot programs are available to facilities that meet the
                following requirements:
              </p>
              <ul className="space-y-3">
                {qualifyingCriteria.map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]/60 mt-1.5 shrink-0" />
                    <span className="text-sm leading-relaxed text-zinc-400">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Target markets */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {targetMarkets.map((market) => (
                <span
                  key={market}
                  className="rounded-full border border-white/[0.08] px-3 py-1 text-xs font-medium tracking-wide text-zinc-600"
                >
                  {market}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right column — contact methods */}
          <div className="space-y-6">
            {/* Primary CTA card */}
            <motion.div
              variants={item}
              className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
                Request a Pilot
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Tell us about your facility and we will send a detailed proposal
                within 48 hours.
              </p>
              <a
                href="mailto:pilots@vigil.health?subject=Pilot%20Program%20Inquiry"
                className="bg-[#00D4AA] text-[#0A0A0F] font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-2 w-full justify-center"
              >
                <Mail className="w-4 h-4" />
                Request Pilot Information
              </a>
              <div className="flex items-center gap-2 mt-4 justify-center">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-xs font-medium tracking-wide text-zinc-600">
                  Response time: within 48 business hours
                </span>
              </div>
            </motion.div>

            {/* Schedule a call */}
            <motion.div
              variants={item}
              className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8"
            >
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
                Schedule a Call
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Speak directly with our clinical partnerships team about
                deployment, integration, and pricing.
              </p>
              <a
                href="mailto:pilots@vigil.health?subject=Schedule%20a%20Call"
                className="border border-white/[0.15] text-[#FAFAFA] px-8 py-3 rounded-lg hover:bg-white/[0.05] transition-all inline-flex items-center gap-2 w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                Schedule a Call
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Contact details */}
            <motion.div
              variants={item}
              className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8 space-y-4"
            >
              <h3 className="text-sm font-medium tracking-wide text-zinc-600 uppercase">
                Direct Contact
              </h3>

              <div className="space-y-3">
                <a
                  href="mailto:pilots@vigil.health"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-4 h-4 text-zinc-600 group-hover:text-[#00D4AA] transition-colors" />
                  <span className="text-sm text-zinc-400 group-hover:text-[#FAFAFA] transition-colors">
                    pilots@vigil.health
                  </span>
                </a>
                <a
                  href="mailto:contact@vigil.health"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-4 h-4 text-zinc-600 group-hover:text-[#00D4AA] transition-colors" />
                  <span className="text-sm text-zinc-400 group-hover:text-[#FAFAFA] transition-colors">
                    contact@vigil.health
                  </span>
                </a>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-400">
                    San Francisco, CA — EST/PST business hours
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Compliance note */}
            <motion.p
              variants={item}
              className="text-xs leading-relaxed text-zinc-600 px-1"
            >
              VIGIL is a pre-market investigational device. Pilot deployments are
              conducted under institutional review. All inquiries are
              confidential.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
