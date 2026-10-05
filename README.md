# Anil Builds

A polished, responsive one-page portfolio for Anil Kumar, sharing hands-on AI projects: a cooperative multiplayer game, private automation workflows, and a weekly newsletter. The page exists to describe the work and invite feedback.

## Features

- Hero, four project cards, About section with a Build, Test, Refine process, and footer
- All / Games / Automation / Newsletter filter buttons (`aria-pressed`) with a live project count
- Mobile navigation, keyboard focus styles, skip link, reduced-motion support, no horizontal overflow
- Warm ivory, charcoal and cobalt palette with CSS-only abstract artwork and system font stacks

## Tech

Next.js (App Router), React, TypeScript and Tailwind CSS. No external APIs, authentication, database, analytics, paid integrations or environment variables.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
```

Project content lives in `lib/projects.ts`.

## Privacy

This site shares descriptions only. It contains no private account data. DateBridge and ReplyPilot are described in words only, with no links, messages, calendar entries or contact details. The site has no contact form, tracking or analytics. The only external link is the Samewave "View campaign" link, which opens in a new tab with `rel="noopener noreferrer"`.
