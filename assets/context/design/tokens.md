# Design Tokens

## Colors

### Backgrounds
- base: `#0A0A0F` → `bg-[#0A0A0F]`
- surface: `#111118` → `bg-[#111118]`
- surface-hover: `#1A1A24` → `bg-[#1A1A24]`
- glass: `rgba(255,255,255,0.03)` → `bg-white/[0.03] backdrop-blur-xl`

### Text
- primary: `#FAFAFA` → `text-[#FAFAFA]`
- secondary: `#A1A1AA` → `text-zinc-400`
- muted: `#52525B` → `text-zinc-600`

### Accent
- teal: `#00D4AA` → `text-[#00D4AA]`
- teal-glow: `rgba(0,212,170,0.15)` → `bg-[#00D4AA]/15`
- indigo: `#6366F1` → `text-indigo-500`
- amber: `#F59E0B` → `text-amber-500`

### Borders
- subtle: `border-white/[0.08]`
- hover: `border-white/[0.15]`

## Typography

### Fonts
- Headings: Cabinet Grotesk → `var(--font-heading)` via `next/font/local`
- Body: Plus Jakarta Sans → `var(--font-body)` via `next/font/google`

### Scale
| Element | Tailwind classes |
|---------|-----------------|
| Hero headline | `text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight` |
| Section headline | `text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight` |
| Subsection | `text-2xl md:text-3xl font-semibold` |
| Body large | `text-lg md:text-xl leading-relaxed text-zinc-400` |
| Body | `text-base leading-relaxed text-zinc-400` |
| Caption | `text-sm font-medium tracking-wide text-zinc-600` |
| Stat number | `text-6xl md:text-8xl font-bold leading-none tracking-tighter tabular-nums` |

## Spacing
- Section padding: `py-24 md:py-32`
- Section horizontal: `px-6`
- Content max-width: `max-w-6xl mx-auto`
- Narrow text: `max-w-3xl`
- Card padding: `p-6 md:p-8`
- Grid gap: `gap-6 md:gap-8`
- Text stack: `space-y-4`

## Radii
- Cards: `rounded-2xl`
- Buttons: `rounded-lg`
- Pills/tags: `rounded-full`

## Effects
- Card glow: `shadow-[0_0_30px_rgba(0,212,170,0.1)]`
- Glassmorphism: `bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]`
- Sensor glow: `shadow-[0_0_20px_rgba(0,212,170,0.3)]`
- Text glow: `drop-shadow-[0_0_12px_rgba(0,212,170,0.4)]`

## Buttons
- Primary: `bg-[#00D4AA] text-[#0A0A0F] font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all`
- Secondary: `border border-white/[0.15] text-[#FAFAFA] px-8 py-3 rounded-lg hover:bg-white/[0.05] transition-all`
- Text link: `text-[#00D4AA] hover:underline underline-offset-4`
