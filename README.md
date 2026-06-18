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

**Also:** TanStack Query, shadcn/ui, date-fns, Lucide icons, Nitro (Node.js server)

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
| `npm run build` | Production build (Node server in `.output/`) |
| `npm run start` | Run production server locally |
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

## Deploy on Hostinger

This app needs **Node.js** (SSR + `/api/chat`). It will **not** run on plain PHP/shared hosting alone.

Use one of these Hostinger options:

| Plan | Works? |
| --- | --- |
| **VPS** | Yes (recommended) |
| **Cloud / Node.js Web App** | Yes, if Node 20+ is available |
| **Basic shared hosting (PHP only)** | No |

Build target: **Nitro `node-server`** (`vite.config.ts`).

### Option A — Hostinger VPS (recommended)

**On your VPS (Ubuntu):**

```bash
# 1. Install Node 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# 2. Clone & build
git clone https://github.com/klodiianamazrekaj/klodi-dev-portfolio.git
cd klodi-dev-portfolio
npm install
cp .env.example .env
nano .env   # add GEMINI_API_KEY

npm run build

# 3. Run with PM2 (keeps app alive)
sudo npm install -g pm2
PORT=3000 pm2 start npm --name klodi-dev -- start
pm2 save
pm2 startup
```

**Nginx** (`/etc/nginx/sites-available/klodi.dev`):

```nginx
server {
    listen 80;
    server_name klodi.dev www.klodi.dev;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/klodi.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d klodi.dev -d www.klodi.dev
```

**DNS (at Hostinger / domain registrar):**

```
Type: A     Name: @    Value: <your VPS IP>
Type: A     Name: www  Value: <your VPS IP>
```

### Option B — Hostinger Node.js Web App

If your plan includes **Node.js Web Applications**, use these settings in hPanel:

| Setting | Value |
| --- | --- |
| **Framework** | Other |
| **Build command** | `npm run build` |
| **Output directory** | `dist` (auto-copied from `.output` after build) |
| **Entry file** | `server/index.mjs` |
| **Node version** | 20+ |
| **Start command** | `npm run start` (optional if entry file is set) |

`npm run build` runs Nitro (output in `.output`), then `postbuild` copies it to `dist` so Hostinger finds the files.

**Alternative:** set Output directory to `.output` and Entry file to `server/index.mjs` (skip the `dist` copy).

Add environment variable: `GEMINI_API_KEY`

Attach domain `klodi.dev` in Hostinger panel.

### After deploy

- Test the site and terminal: `ask Are you open to remote roles?`
- Test CV download
- Redeploy after changing `.env` on the server

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
