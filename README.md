# SURVIVAL COMMAND

**A survival operating system for ordinary people.** A calm emergency operations
assistant that helps you go from *"Something has gone terribly wrong, I don't
know what to do"* to *"I know the biggest threat, I know what I have, I know
what to do next, and I have a plan if things get worse."*

This is a **mobile-first, offline-first** application. Core survival knowledge
is stored locally and works with **no internet, no cellular, and no backend**.

---

## Why it's built this way (no framework)

The build environment has **no access to the npm registry or public CDNs**, so
frameworks like React/Vite could not be installed. Rather than ship a broken
project, SURVIVAL COMMAND is a **zero-dependency application** written in plain
TypeScript and compiled with the locally available `tsc`. It uses:

- A tiny DOM helper (`src/ui/dom.ts`) instead of a UI framework
- A hash router (`src/ui/router.ts`)
- A reactive `localStorage`-backed store (`src/model/store.ts`)
- A service worker (`public/sw.js`) for true offline capability

The result installs nothing, runs entirely in the browser, and keeps working
when the network disappears.

## Run it

The compiled output in `public/app/` is **committed**, so the app runs with **no
build step** — just serve the `public/` folder with any static server.

```bash
# Serve the static app (no install, no build required)
npm run serve        # http://localhost:5173
```

### Rebuilding after changing `src/`

```bash
npm install          # installs the TypeScript devDependency
npm run build        # tsc -> public/app/
npm run watch        # recompile on change
```

### Deploying (static hosting)

Deploy the **`public/`** directory as a static site with **no build command**.
A `vercel.json` is included that does exactly this (`outputDirectory: public`,
no build/install step, SPA rewrite to `index.html`). Any static host works —
GitHub Pages, Netlify, Cloudflare Pages, S3, etc. — point it at `public/`.

> Note: earlier a deploy failed with `sh: tsc: command not found` because the
> host had no global TypeScript. That is now avoided entirely: the build output
> is committed and the site deploys as pure static files with no build step.

Open the URL on a phone-sized viewport for the intended experience. Toggle the
device offline — the app keeps working and shows an **OFFLINE MODE** banner.

## What's inside (Phase 1 MVP)

| Area | Feature |
|------|---------|
| **Home** | Threat level, six status cards, and the single most important action ("What should I do now?") with Start / Why / Done / I can't do this |
| **Priority engine** | Continuously re-ranks needs by threat-to-life, scarcity, time sensitivity, environment, and vulnerability |
| **Emergency Mode** | Three-choice triage → immediate danger, infrastructure failure, or "safe but preparing"; switches on high-contrast **Stress Mode** |
| **Scenario library** | Grid failure (with decision tree), water failure, comms failure, earthquake, flood, wildfire, extreme heat, extreme cold, storm/hurricane — each with phased actions, do-nots, checklist, evacuation triggers, medical/environmental notes |
| **Water Command Center** | Potable / treatable / contaminated / unknown classification, water budget, approximate days remaining, honest treatment limits |
| **Resources** | Water, food, power budget, full inventory, redundancy guidance |
| **Prepare** | Emergency kit builder, 0–100 preparedness score with gap analysis, 60-second readiness check |
| **72-Hour & 7-Day plans** | Phased survival → sustainability plans with progress tracking |
| **Commander** | Offline assistant returning *Situation / Most important problem / Do this now / Next / Avoid / If conditions change* — asks one question when info is missing, never invents certainty |
| **Improvise** | Safe household improvisation database, "Can I use this?" object explorer, and "I have nothing" mode |
| **Family / Community** | Downloadable offline info card and neighbour status tracking |
| **What If?** | Simulates consequences of a scenario against your current inventory |

## Design principles

1. **Life first** — life safety always outranks convenience.
2. **Action over information** — every emergency screen leads with *DO THIS NOW*.
3. **Resource management** — quantities in, approximate days remaining out (always labelled approximate).
4. **Honest safety** — no dangerous improvisation; the app never implies a random filter/cloth/boil makes contaminated water safe.
5. **Never overwhelm** — one clear priority at a time, deeper detail on request.

## Safety & data

- All estimates are **approximate** and clearly labelled as such.
- Content excludes anything hazardous to improvise (mains electricity, weapons,
  explosives, dangerous chemistry, unsafe pressure/fuel).
- Local data is never wiped on a load or sync failure.

> This application provides general emergency preparedness information. It does
> not replace emergency services, local authorities, medical professionals,
> utility providers, or official evacuation instructions. During active
> disasters, follow official emergency instructions when available.

## Project structure

```
public/            static shell (index.html, styles.css, sw.js, manifest, icon)
  app/             compiled JS output (generated by `npm run build`)
scripts/serve.mjs  zero-dependency static server
src/
  model/           types + reactive localStorage store
  data/            modular scenario knowledge base, improvise DB, kit
  engine/          priority engine, estimators, Commander, preparedness score
  ui/              dom helper, router, shared components, stress mode
  views/           one module per screen
```

## Roadmap

- **Phase 2**: richer decision trees, power/water budgeting depth, voice mode.
- **Phase 3**: offline maps, live official alerts, weather integration.
