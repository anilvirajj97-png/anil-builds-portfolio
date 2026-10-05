# Anil Builds

A responsive one-page portfolio for Anil Kumar, sharing hands-on AI projects: a cooperative multiplayer game, private automation workflows, and a weekly newsletter. The page exists to describe the work and invite feedback.

- Live site: https://anil-builds-portfolio-d5.vercel.app/
- Public source: https://github.com/anilvirajj97-png/anil-builds-portfolio

## Features

- Midnight-navy design with cobalt and ice-blue lighting, warm ivory text and system font stacks
- Interactive WebGL hero (Three.js): a luminous central orb with four orbiting project nodes — Samewave, DateBridge, ReplyPilot and AI Builder Weekly
- Four project cards below the hero with working All / Games / Automation / Newsletter filters (`aria-pressed`) and a live project count
- About section with a Build, Test, Refine process, and a footer with a "View source on GitHub" link
- Mobile navigation, skip link, visible focus styles, no horizontal overflow

## Hero interactions

- **Rotate:** drag the scene sideways (mouse or touch) to rotate it. Mouse users can also drag vertically to tilt, within a bounded range. On touch screens vertical swipes always scroll the page; the canvas uses `touch-action: pan-y` and never captures touch scrolling.
- **Select:** click or tap a labelled node, or use the project buttons. The selected project's factual summary appears in a regular HTML panel, with its existing legitimate link when one exists (only Samewave has one).
- **Keyboard and assistive tech:** every action has an HTML control — a button per project, Reset view, Pause/Resume animation, and Rotate left/right. All text lives in HTML; node labels on the canvas are decorative and hidden from assistive technology.
- **Reduced motion:** if the visitor prefers reduced motion, the animation starts paused. They can resume it with the Pause/Resume button.
- **Performance:** the scene is code-split and loaded client-side only, uses low-poly geometry, procedural shapes and a tiny generated glow texture, caps the device pixel ratio (1.25 on small screens, 1.5 otherwise), pauses rendering while off-screen or in a hidden tab, and loads no external models, images, fonts, APIs or analytics.

## Fallback

If WebGL is unavailable, the scene fails to load, or rendering errors or loses its context, the hero switches to a static illustration of the same orb and orbiting projects. The project buttons and the details panel keep working, and a short status message explains that the 3D view is unavailable. While the 3D chunk is loading, the same static illustration is shown.

## Tech

Next.js (App Router), React, TypeScript, Tailwind CSS and Three.js. No external APIs, authentication, database, analytics, paid integrations or environment variables.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
npx tsc --noEmit  # type check
```

Project content lives in `lib/projects.ts`. The 3D scene lives in `components/orb-scene.tsx`, its lazy-loading wrapper and fallback in `components/hero-stage.tsx` and `components/static-orb.tsx`.

## Privacy

This site shares descriptions only. It contains no private account data. DateBridge and ReplyPilot are described in words only, with no links, messages, calendar entries or contact details. The site has no contact form, tracking or analytics. External links are the Samewave "View campaign" link and the "View source on GitHub" footer link, both opening in a new tab with `rel="noopener noreferrer"`.
