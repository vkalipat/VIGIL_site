"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const INQUIRY_EMAIL = "info@vigilsystems.site";

const interests = [
  "Investment",
  "Partnership",
  "General inquiry",
] as const;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    interest: interests[0] as string,
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `${form.interest} — ${form.name || "VIGIL inquiry"}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.organization ? `Organization: ${form.organization}` : null,
      `Interest: ${form.interest}`,
      "",
      form.message,
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  const fieldClass =
    "w-full rounded-lg bg-[#0A0A0F] border border-white/[0.1] px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-zinc-600 outline-none transition-colors focus:border-[#00D4AA]/60";

  return (
    <section id="contact" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase">
            Investor &amp; Partnership Inquiries
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            Register Your Interest
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
            VIGIL is an early-stage clinical monitoring venture. We&apos;d love to
            hear from investors, strategic partners, and anyone who wants to learn
            more. Send us a note and we&apos;ll get back to you.
          </p>
        </motion.div>

        {/* Inquiry form */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-2xl bg-[#111118] border border-white/[0.08] p-6 md:p-8"
        >
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00D4AA]/10">
                <CheckCircle2 className="w-6 h-6 text-[#00D4AA]" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA]">
                Thanks for reaching out
              </h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                Your email draft is ready in your mail client. If it didn&apos;t
                open, write to us directly at{" "}
                <a
                  href={`mailto:${INQUIRY_EMAIL}`}
                  className="text-[#00D4AA] hover:underline"
                >
                  {INQUIRY_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Jane Doe"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="jane@firm.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    Organization{" "}
                    <span className="text-zinc-700 normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    placeholder="Firm or company"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    I&apos;m interested in
                  </label>
                  <select
                    value={form.interest}
                    onChange={(e) => update("interest", e.target.value)}
                    className={`${fieldClass} appearance-none`}
                  >
                    {interests.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0A0A0F]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us a bit about what you're looking for…"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="bg-[#00D4AA] text-[#0A0A0F] font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-2 w-full justify-center"
              >
                <Send className="w-4 h-4" />
                Send Inquiry
              </button>
            </form>
          )}
        </motion.div>

        {/* Direct contact + note */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-8 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href={`mailto:${INQUIRY_EMAIL}`}
              className="flex items-center gap-2 group"
            >
              <Mail className="w-4 h-4 text-zinc-600 group-hover:text-[#00D4AA] transition-colors" />
              <span className="text-sm text-zinc-400 group-hover:text-[#FAFAFA] transition-colors">
                {INQUIRY_EMAIL}
              </span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-600" />
              <span className="text-sm text-zinc-400">
                Cumming, GA — EST/PST business hours
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 max-w-md">
            VIGIL is a pre-market investigational device. All inquiries are
            confidential.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
