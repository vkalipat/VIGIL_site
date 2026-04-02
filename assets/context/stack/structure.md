# Site Structure

```
site/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, body classes
│   ├── page.tsx            # Assembles all sections in order
│   └── globals.css         # Tailwind directives only
├── sections/               # One file per page section
│   ├── Hero.tsx
│   ├── SensorShowcase.tsx
│   ├── Stats.tsx
│   ├── HowItWorks.tsx
│   ├── DataPreview.tsx
│   ├── Specs.tsx
│   ├── Validation.tsx
│   └── CTA.tsx
├── components/             # Reusable UI shared across sections
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AnimatedNumber.tsx
│   └── SensorDot.tsx
├── lib/                    # Data, config, helpers
│   ├── sensors.ts          # Sensor config array (id, name, icon, position, metric)
│   ├── specs.ts            # Full spec table data
│   └── fonts.ts            # next/font declarations
├── public/
│   ├── images/             # Product photos, hero image
│   ├── models/             # .glb/.gltf 3D assets
│   └── fonts/              # Cabinet Grotesk .woff2 files
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Rules

| Rule | Detail |
|------|--------|
| Sections go in | `sections/` — one component per file |
| Reusable UI goes in | `components/` — shared across 2+ sections |
| Data/config goes in | `lib/` — no JSX |
| Static assets go in | `public/` — subfolder per type |
| One component per file | File name = component name, PascalCase |
