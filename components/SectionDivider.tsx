'use client'

import { motion } from 'framer-motion'

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <motion.div
        className="h-px bg-[#00D4AA]/30"
        initial={{ width: '0%' }}
        whileInView={{ width: '60%' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
