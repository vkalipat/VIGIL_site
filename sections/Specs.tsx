'use client'

import { motion } from 'framer-motion'

const specs = [
  {
    category: 'Sensors',
    items: [
      { name: 'PVDF piezoelectric', value: 'TE LDT1-028K \u00d72, bilateral' },
      { name: 'Temperature', value: 'TI TMP117, \u00b10.15\u00b0C' },
      { name: 'Accelerometer', value: 'ST LIS3DH, tri-axis' },
      { name: 'Microphone', value: 'TDK ICS-43434, 65 dBA SNR' },
    ],
  },
  {
    category: 'Performance',
    items: [
      { name: 'Pulse sampling rate', value: '200 Hz' },
      { name: 'Temperature sampling', value: '1 Hz' },
      { name: 'Acoustic sampling', value: '16 kHz' },
      { name: 'Processing latency', value: '<50ms' },
      { name: 'Data points per 24hrs', value: '17,280' },
      { name: 'Battery life', value: '18\u201324 hours' },
      { name: 'Charge time', value: '~90 min' },
    ],
  },
  {
    category: 'Design',
    items: [
      { name: 'Weight', value: '<45g' },
      { name: 'PCB', value: '2-layer flex, 185mm \u00d7 35mm' },
      { name: 'Housing', value: 'Medical-grade silicone' },
      { name: 'SoC', value: 'Nordic nRF52840' },
    ],
  },
  {
    category: 'Connectivity',
    items: [
      { name: 'BLE', value: '5.0' },
      { name: 'Range', value: '27m (22dB margin at 5m)' },
    ],
  },
  {
    category: 'Cost',
    items: [
      { name: 'Prototype (5 units)', value: '$46/unit' },
      { name: '1K volume', value: '$19/unit' },
      { name: '10K volume', value: '$13/unit' },
    ],
  },
  {
    category: 'License',
    items: [{ name: 'Hardware', value: 'CERN OHL v2' }],
  },
]

const groupContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const groupItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const rowContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const rowItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Specs() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Specifications
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            Technical Specifications
          </h2>
        </motion.div>

        <motion.div
          variants={groupContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {specs.map((group) => (
            <motion.div key={group.category} variants={groupItem}>
              <h3 className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-4">
                {group.category}
              </h3>
              <motion.div
                variants={rowContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {group.items.map((spec) => (
                  <motion.div
                    key={spec.name}
                    variants={rowItem}
                    className="flex justify-between py-3 border-b border-white/[0.08] border-l-2 border-l-transparent hover:border-l-[#00D4AA] hover:bg-[#00D4AA]/[0.04] px-3 -mx-3 rounded-sm transition-all duration-300"
                  >
                    <span className="text-zinc-400">{spec.name}</span>
                    <span className="text-[#FAFAFA] font-medium font-mono text-sm">
                      {spec.value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
        >
          <a
            href="#"
            className="text-[#00D4AA] hover:underline underline-offset-4 transition-all duration-150"
          >
            Download Full Specs (PDF)
          </a>
        </motion.div>
      </div>
    </section>
  )
}
