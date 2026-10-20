# Piyush Bhuyan Portfolio.

Portfolio built with React, TypeScript, and Vite, with two views: a classic, recruiter-friendly layout and a retro-futuristic CLI terminal.

Live site: [https://pibuilt.github.io/pibuilt-piyush_portfolio/](https://pibuilt.github.io/pibuilt-piyush_portfolio/)

## Overview

The default experience is **Classic Mode** — a clean, multi-page layout (hash-routed) aimed at anyone who wants to skim the resume fast. A **CLI Mode** toggle switches to a command-driven terminal experience inspired by modern AI/CLI tooling, and both views read from the same content source.

- Classic Mode is the default; the view choice persists per browser
- Multi-page Classic navigation: Home, Experience & Education, Projects, Resume, Beyond Engineering, Contact
- CLI Mode: single prompt interaction model with slash-command navigation and a Claude-like response flow
- Subtle boot/loader animation when entering the terminal (skipped in Classic)
- Static deployment with GitHub Pages + GitHub Actions CI/CD

## Features

- Two views sharing one typed content model: Classic Mode and CLI Mode
- Instant, persistent view toggle (survives reloads via localStorage)
- Classic Mode: hash-routed pages, tabbed skills panel, timeline experience, resume download
- CLI Mode: terminal UI with autocomplete suggestions and a command cheatsheet panel
- Smooth boot sequence and transition into the terminal
- Session guard so the boot animation does not replay after first load in the same tab session
- Resume download available from both views
- Hidden **Buildlands** game reachable from CLI Mode (`/game`)

## Tech Stack

- React 19
- TypeScript
- Vite
- Plain CSS (custom design tokens and effects)
- GitHub Pages (hosting)
- GitHub Actions (build + deploy pipeline)

## Project Structure

```text
Portfolio/
├── public/
│   ├── Piyush_Bhuyan_Resume.pdf
│   ├── beyondengg/
│   │   ├── comic.jpeg
│   │   ├── lego.jpeg
│   │   └── mun.jpeg
│   └── realm-assets/
│       ├── KENNEY-LICENSE.txt
│       ├── KNIGHTS-CREDIT.md
│       ├── ROBOT-LAB-README.md
│       ├── knight.png
│       ├── environment/
│       ├── lab/
│       ├── structures/
│       ├── tiles/
│       └── units/
├── src/
│   ├── classic/
│   │   ├── ClassicPortfolio.tsx
│   │   └── classic.css
│   ├── data/
│   │   └── portfolio.ts
│   ├── realm/
│   │   ├── RealmGame.tsx
│   │   ├── realm.css
│   │   ├── realmConfig.ts
│   │   ├── realmJournal.ts
│   │   ├── pathfinding.ts
│   │   ├── rapidTap.ts
│   │   ├── routeGuard.ts
│   │   └── *.test.ts
│   ├── App.tsx
│   ├── ViewModeToggle.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Views

### Classic Mode (default)

A conventional, recruiter-friendly layout suited to skimming. Pages are hash-routed:

- `#/home`
- `#/experience`
- `#/projects`
- `#/resume`
- `#/beyond`
- `#/contact`

### CLI Mode

A command-driven terminal experience. Toggle to it from either view via the header switch; the choice is remembered in `localStorage`.

## Commands (CLI Mode)

Supported commands:

- `/help`
- `/about`
- `/experience`
- `/projects`
- `/skillset`
- `/certifications`
- `/education`
- `/publications`
- `/connect`
- `/resume`

Aliases are supported and defined in `src/data/portfolio.ts`.

The Buildlands game is reached with `/game`. A hidden secret command also exists — exploring is part of the fun.

## Local Development

Prerequisites:

- Node.js 20+ recommended
- npm

Install and run:

```bash
npm install
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages + CI/CD)

This repo is configured to deploy automatically on every push to `main`.

### 1) Base path for project pages

`vite.config.ts` is set to:

```ts
base: "/pibuilt-piyush_portfolio/";
```

This is required because the site is hosted under a repository path.

### 2) GitHub Actions workflow

Workflow file: `.github/workflows/deploy.yml`

On push to `main`, it:

1. checks out the repo
2. sets up Node 20 with npm cache
3. installs deps with `npm ci`
4. builds with `npm run build`
5. uploads `dist/` as Pages artifact
6. deploys with `actions/deploy-pages`

### 3) GitHub Pages settings

In repository settings:

- Go to **Settings -> Pages**
- Set **Build and deployment source** to **GitHub Actions**

Once workflow completes, the site is published automatically.

## Content and Styling Updates

- Update portfolio data (shared by both views) in `src/data/portfolio.ts`
- Update Classic Mode layout/styling in `src/classic/ClassicPortfolio.tsx` and `src/classic/classic.css`
- Update CLI terminal theme and effects in `src/styles.css`
- Update CLI interaction/command behavior in `src/App.tsx`
- Update the off-the-clock photos in `public/beyondengg/`

## Notes

- Fully static app (no backend/API required)
- Deploy artifacts are generated in `dist/`
- Resume file is served from `public/Piyush_Bhuyan_Resume.pdf`
- Both views render from the same content source, so edits stay in sync

## Game Asset Credits

The Buildlands (enter `/game` in the terminal) is built entirely from free, community-made art. None of these assets are original work. All three packs are released under CC0, so no permission was required — attribution below is given as a thank-you.

- **Medieval world, buildings, scenery, and units** — [Kenney Vleugels](https://kenney.nl/), [RTS Pack: Medieval](https://kenney.nl/assets/medieval-rts) · CC0
- **Laboratory machines, drones, and technology props** — [Murphy's Dad](https://murphysdad.itch.io/), [Robot Lab](https://murphysdad.itch.io/robot-lab-asset-pack) · CC0
- **Playable knight sprite** — [zwonky](https://opengameart.org/users/zwonky), [Knights](https://opengameart.org/content/knights) · CC0

Upstream license files are shipped alongside the assets in `public/realm-assets/` (`KENNEY-LICENSE.txt`, `ROBOT-LAB-README.md`, `KNIGHTS-CREDIT.md`). The same credits also appear in-game via the **Art Credits** landmark, plus a persistent footer line on the game screen.
