# Piyush Bhuyan Portfolio.

Terminal-first portfolio built with React, TypeScript, and Vite.

Live site: [https://pibuilt.github.io/pibuilt-piyush_portfolio/](https://pibuilt.github.io/pibuilt-piyush_portfolio/)

## Overview

This is a command-driven portfolio experience inspired by modern AI/CLI tooling and styled with a retro-futuristic terminal aesthetic.

- Single prompt interaction model
- Slash-command navigation
- Claude-like response flow with lightweight processing states
- Subtle boot/loader animation before entering the terminal
- Static deployment with GitHub Pages + GitHub Actions CI/CD

## Features

- Terminal-style UI with autocomplete suggestions
- Command cheatsheet panel for quick navigation
- Smooth boot sequence and transition into the main page
- Session guard so boot animation does not replay after first load in the same tab session
- Resume download via top nav and `/resume` command
- Typed content model separated from UI logic

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
│   └── Piyush_Bhuyan_Resume.pdf
├── src/
│   ├── data/
│   │   └── portfolio.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Commands

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
base: "/piyush_portfolio/";
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

- Update portfolio data in `src/data/portfolio.ts`
- Update visual theme and effects in `src/styles.css`
- Update interaction/command behavior in `src/App.tsx`

## Notes

- Fully static app (no backend/API required)
- Deploy artifacts are generated in `dist/`
- Resume file is served from `public/Piyush_Bhuyan_Resume.pdf`
