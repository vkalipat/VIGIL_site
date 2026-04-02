# Sections

Build order: 1 → 9. Complete each before starting the next.

---

## 1. Hero
**File**: `site/sections/Hero.tsx` — client component
**Content**: Tagline + subtitle + primary CTA ("Pre-order") + secondary CTA ("Explore", scrolls to #sensors) + product image (centered, placeholder until real asset)
**Layout**: Centered stack. Image above on mobile, overlapping on desktop. `min-h-screen`.
**Animation**: Staggered entrance (pattern 2). Image first, text second, CTAs third. 0.15s stagger.
**Copy source**: `sensors/copy.md` → Hero section

---

## 2. Sensor Showcase
**File**: `site/sections/SensorShowcase.tsx` — client component
**Content**: Headband image pinned center. 5 sensors reveal with scroll. Each sensor shows: icon (lucide), name, one-line description, key metric.
**Layout**: GSAP pinned section (pattern 7). Wrapper height = 500vh (100vh per sensor). Sticky inner container at `h-screen`. Sensor data overlays on left or right side.
**Animation**: GSAP pin + scrub. Divide `self.progress` into 5 segments (0–0.2, 0.2–0.4, etc.). Active sensor dot scales up + teal glow. Text crossfades between sensors.
**Data source**: `sensors/specs.md` → sensor list
**Dot positions**: Define per sensor in a config array: `{ id, name, description, metric, icon, dotPosition: { top, left } }`

---

## 3. Stats Bar
**File**: `site/sections/Stats.tsx` — client component
**Content**: 4 stat items in a row. Values from `sensors/specs.md`.
**Layout**: `flex justify-between max-w-4xl mx-auto`. Centered text per stat. Number above, label below.
**Animation**: Pattern 6 (count-up). All numbers count simultaneously when section enters viewport.
**Typography**: Number = stat scale from tokens. Label = caption scale from tokens.

---

## 4. How It Works
**File**: `site/sections/HowItWorks.tsx` — client component
**Content**: Section headline + 4 steps (icon + title + description each). Copy from `sensors/copy.md`.
**Layout**: Horizontal on desktop with connecting line between steps. Vertical stack on mobile.
**Animation**: Pattern 2 (staggered children). Steps enter left to right.
**Icons**: `Headphones` (put on), `Zap` (activate), `Bluetooth` (stream), `BarChart3` (insights) from lucide-react.

---

## 5. Data Preview
**File**: `site/sections/DataPreview.tsx` — client component
**Content**: Section headline + subtitle + 4 chart cards:
1. EEG waveform — canvas + requestAnimationFrame, 4 layered sine waves, teal/indigo colors, sweeping left-to-right
2. Heart rate trend — Recharts `LineChart`, 60 fake data points (58–82 BPM), teal stroke, no dots, `monotone` curve
3. Sleep stages — Recharts `BarChart`, 5 bars (Awake, REM, Light, Deep, Wake), indigo fill
4. Focus score — custom SVG circle gauge, animated `stroke-dashoffset` via framer-motion, value "87"
**Layout**: 2×2 grid desktop, single column mobile. Each card: `bg-[#111118] rounded-2xl p-6 border border-white/[0.08]`
**Animation**: Pattern 1 (fade-up) on container. Waveform canvas starts animating when `useInView` returns true.
**Charts**: Wrap all Recharts in `<ResponsiveContainer width="100%" height={150}>`. Hide axes.
**Copy source**: `sensors/copy.md` → Data Preview section

---

## 6. Specs
**File**: `site/sections/Specs.tsx` — client component
**Content**: Section headline + spec table from `sensors/specs.md` → Full Spec Table.
**Layout**: Two-column rows. Left: spec name (text-zinc-400). Right: value (text-[#FAFAFA] font-medium). Rows separated by `border-b border-white/[0.08]`. Group by category with category headers.
**Animation**: Pattern 2 (staggered rows). Each row fades up.
**Footer**: "Download Full Specs (PDF)" text link.

---

## 7. Validation
**File**: `site/sections/Validation.tsx` — client component
**Content**: Section headline "Clinically Validated" + body text + certification badges row.
**Layout**: Centered text block, max-w-3xl. Badges in flex row below, gap-8, grayscale → full color on hover.
**Animation**: Pattern 1 (fade-up).
**Copy source**: `sensors/copy.md` → Validation section

---

## 8. CTA
**File**: `site/sections/CTA.tsx` — client component
**Content**: Headline + subtext + primary button ("Pre-order Now") + secondary button ("Join the Waitlist").
**Layout**: Centered, `py-32`. Max-w-2xl.
**Animation**: Pattern 1 (fade-up). Add subtle teal radial gradient glow behind headline: `bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.08)_0%,transparent_70%)]`
**Copy source**: `sensors/copy.md` → CTA section

---

## 9. Navbar + Footer
**Navbar file**: `site/components/Navbar.tsx` — client component
**Content**: Logo (text, product name) left. "Pre-order" button right. Fixed top, transparent bg with `backdrop-blur-md` on scroll.
**Footer file**: `site/components/Footer.tsx` — server component
**Content**: Logo, copyright line, links: Privacy, Terms, Contact.
**Layout**: Simple centered or two-column, `py-12 border-t border-white/[0.08]`.

---

## page.tsx assembly order
```tsx
<Navbar />
<Hero />
<SensorShowcase />
<Stats />
<HowItWorks />
<DataPreview />
<Specs />
<Validation />
<CTA />
<Footer />
```
