# Animation Patterns

Default easing for all animations: `[0.16, 1, 0.3, 1]`

## 1. Fade-up entrance (use for everything unless otherwise specified)

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
```

## 2. Staggered children (cards, rows, lists)

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(i => <motion.div key={i.id} variants={item} />)}
</motion.div>
```

## 3. Parallax (floating images, decorative elements)

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
const y = useTransform(scrollYProgress, [0, 1], [100, -100])

<motion.div ref={ref}>
  <motion.img style={{ y }} />
</motion.div>
```

## 4. Scroll-linked value (rotation, opacity tied to scroll position)

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
```

## 5. Hover (cards, buttons)

```tsx
<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}>
```

## 6. Count-up number

```tsx
import { useInView, useMotionValue, animate, useTransform } from 'framer-motion'

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const display = useTransform(count, v => Math.round(v))

  useEffect(() => {
    if (isInView) animate(count, target, { duration: 1.5, ease: [0.16, 1, 0.3, 1] })
  }, [isInView])

  return <span ref={ref}><motion.span>{display}</motion.span>{suffix}</span>
}
```

## 7. GSAP pinned section (sensor showcase ONLY)

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function PinnedSection() {
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // self.progress: 0–1
        }
      })
    }, wrapper)
    return () => ctx.revert()
  }, [])

  return <div ref={wrapper} className="h-screen relative" />
}
```

## Rules
- Only animate `transform` and `opacity`. Never width, height, margin, padding.
- Always `viewport={{ once: true }}`.
- Never use CSS @keyframes or CSS transition for entrances.
- Never animate the same element with both framer-motion and gsap.
- Pattern 7 (GSAP) is only for the sensor showcase pinned section.
