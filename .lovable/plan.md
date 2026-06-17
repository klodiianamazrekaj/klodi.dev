# Signature Feature: "Ask my workspace" — AI assistant + live GitHub panel

Two connected additions that deepen the code-editor metaphor with **real data** and a genuine **wow moment**, while keeping your existing design, tokens, and layout untouched.

## The idea in one line
Recruiters can *talk to your portfolio* in the terminal and *see your real coding activity* in a Source Control panel — exactly the two things a developer expects from a real editor, but no portfolio actually has.

---

## Part 1 — AI Pair Reviewer (the centerpiece)

Your terminal already accepts commands. We add a natural-language mode powered by Lovable AI that answers **in your voice**, grounded only in your real portfolio data (about, experience, skills, projects, availability).

What a visitor can do:
```text
klodianamazrekaj@dev:~$ ask what's your strongest area?
klodianamazrekaj@dev:~$ ask are you open to remote roles?
klodianamazrekaj@dev:~$ ask which project best shows your backend skills?
```
- Answers stream token-by-token into the terminal (real editor-AI feel).
- The model is **constrained to your data** — it won't invent facts. If asked something out of scope, it says so and points to `contact.md`.
- A little personality: a defined tone (confident, warm, concise) baked into the system prompt so it sounds like you, not a generic bot.
- Suggested prompt chips appear when the terminal opens, so recruiters know it's interactive within the 5-second rule.
- Command palette entry: "Ask the workspace (AI)".

Why it wows: it's the literal Cursor/Copilot experience, applied to *you*. A recruiter remembers "the portfolio I could interview."

## Part 2 — Live GitHub Source Control panel

VS Code has a Source Control tab; yours will be real. A new activity-bar/sidebar view fetches live data from the GitHub API:
- Your latest public commits (`git log` style list with repo + message + relative time).
- Contribution count / streak summary.
- Pinned/top repositories as cards with language, stars, and a link.
- A `git log` terminal command that prints the same live feed.

This proves you actually ship code, updates itself forever, and reinforces the editor metaphor.

---

## Personality touches (subtle, on-brand)
- A `status` line in the title bar / terminal header reading availability (e.g. "● Available for work") driven by a single config value you control.
- The AI's tone profile so answers feel personal, not corporate.

These stay within your existing cyan/oklch token system and typography — no visual redesign.

---

## What I need from you
- Your **GitHub username** (for the live panel) — confirm it's `klodiana` or give the correct handle.
- Optional: a 1–2 sentence note on tone/availability you want the AI to reflect (otherwise I'll infer from your existing copy).

---

## Technical section
**Stack:** TanStack Start (existing). Lovable AI via the AI Gateway for the assistant; GitHub REST API for activity.

**AI assistant**
- Streaming server route at `src/routes/api/chat.ts` using `streamText` + `toUIMessageStreamResponse`, model `google/gemini-3-flash-preview`, `LOVABLE_API_KEY` read server-side only.
- System prompt embeds a compact, structured snapshot of `portfolio-data.tsx` (about/experience/skills/projects/contact) and strict guardrails: answer only from provided context, stay in defined voice, redirect out-of-scope questions to contact.
- Terminal (`TerminalPanel.tsx`) gains an `ask <question>` command (and a free-type mode) that POSTs to the route and renders streamed tokens into the existing line list — reusing current styling, no new visual language.
- `CommandPalette.tsx`: add "Ask the workspace (AI)" focusing the terminal in ask-mode.
- Errors surfaced inline in the terminal: `429` → retry later, `402` → friendly "AI credits paused" line.

**GitHub Source Control panel**
- `createServerFn` (`src/lib/github.functions.ts`) calling GitHub REST (`/users/{user}/events/public`, `/users/{user}/repos?sort=updated`), shaped to a small typed payload; cached via TanStack Query with `ensureQueryData` in a loader-safe pattern (public route — no auth middleware).
- New sidebar view component reusing existing `Sidebar`/card patterns and tokens; new `git log` terminal command consuming the same server fn.
- Optional `GITHUB_TOKEN` secret later if rate limits become an issue; unauthenticated calls are fine to start.

**Guardrails respected**
- No edits to `routeTree.gen.ts`; new route file only.
- `process.env` read inside handlers; nothing leaked to the client.
- Existing default file (`about`), tabs, terminal commands, resizing, and theme behavior all preserved — this is purely additive.

If you'd prefer to ship just one of the two parts first, I'd start with the **AI Pair Reviewer** since it's the bigger differentiator.