# klodi.dev

**An IDE-style portfolio for a Full Stack Software Engineer.**

Instead of a traditional landing page, this site is a working **code editor workspace** — file explorer, tabs, syntax-highlighted content, terminal, and command palette. Visitors explore my work the same way I explore a codebase.

**Live:** [klodi.dev](https://klodi.dev)

---

## What you get

| Area | What it does |
| --- | --- |
| **File explorer** | Open `about.ts`, `experience.json`, `skills.config.ts`, projects, contact, and more |
| **Project views** | Structured case studies with stack, status, and feature breakdown |
| **Terminal** | Run commands (`help`, `whoami`, `skills`, `projects`, `contact`, `hire`) |
| **AI assistant** | Ask questions in the terminal — answers are grounded in portfolio data only |
| **Command palette** | `⌘K` / `Ctrl+K` to jump files and actions quickly |
| **Download CV** | One-click PDF download from the header |
| **Klo Noir Rose theme** | Interactive preview of a custom Cursor / VS Code theme |

---

## Highlights

- Real-time systems: GPS tracking (Teltonika), ISP monitoring, live dashboards
- Full-stack ownership: Figma → frontend → APIs → production
- Client projects shipped live: Infinit International, ECOAB Plus, Taverna Hyjnesha
- Built and designed as a portfolio **from scratch** — including this workspace UI

---

## Tech stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-Router-EF4444?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-state-443B2E)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-0055FF?logo=framer&logoColor=white)
![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-terminal_AI-000000?logo=vercel&logoColor=white)

**Also:** TanStack Query, shadcn/ui, date-fns, Lucide icons, Nitro (Vercel deploy)

---

## Local development

```bash
git clone https://github.com/klodiianamazrekaj/klodi-dev-portfolio.git
cd klodi-dev-portfolio
npm install
cp .env.example .env
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:8080`).

### Environment variables

Copy `.env.example` to `.env`. **Never commit `.env`.**

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For AI terminal | Powers `ask` commands via Gemini |
| `LOVABLE_API_KEY` | Alternative | Lovable AI Gateway (if deployed on Lovable) |
| `GITHUB_TOKEN` | Optional | Higher GitHub API rate limits |

Without an AI key, the site works — only the terminal assistant is disabled.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build (Vercel-ready) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Project structure

```text
src/
├── components/workspace/   # IDE UI (sidebar, editor, terminal, title bar)
├── lib/
│   ├── portfolio-data.tsx  # Files, projects, experience, skills content
│   ├── assistant-context.ts # AI grounding context
│   └── cv.ts               # CV download helpers
├── routes/
│   ├── index.tsx           # Main workspace page
│   └── api/chat.ts         # Terminal AI endpoint
├── themes/                 # Klo Noir Rose theme tokens
public/
├── cv.pdf                  # Downloadable CV
└── napping.png             # Terminal mascot
```

Content lives mainly in `src/lib/portfolio-data.tsx` — the explorer is driven by that data, not a CMS.

---

## Deploy

Configured for **Vercel** (`nitro` preset in `vite.config.ts`).

1. Push to GitHub (public repo)
2. Import project on [vercel.com](https://vercel.com)
3. Add `GEMINI_API_KEY` under **Environment Variables**
4. Point `klodi.dev` to Vercel in your DNS settings

---

## Contact

| | |
| --- | --- |
| **Website** | [klodi.dev](https://klodi.dev) |
| **Email** | [info@klodi.dev](mailto:info@klodi.dev) |
| **LinkedIn** | [in/klodiana-mazrekaj](https://www.linkedin.com/in/klodiana-mazrekaj/) |
| **GitHub** | [@klodiianamazrekaj](https://github.com/klodiianamazrekaj) |

---

Built by **Klodiana Mazrekaj** — Full Stack Software Engineer.
