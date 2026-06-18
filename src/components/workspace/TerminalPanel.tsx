import { useEffect, useRef, useState } from "react";
import { ChevronUp, Sparkles, TerminalSquare, X } from "lucide-react";
import { CODE, PROJECTS } from "@/lib/portfolio-data";
import { downloadCv } from "@/lib/cv";
import { useWorkspace } from "@/store/workspace";
import { cn } from "@/lib/utils";

const TERMINAL_CAT = "/napping.png";

function TerminalMascot() {
  return (
    <img
      src={TERMINAL_CAT}
      alt=""
      aria-hidden
      className="pointer-events-none absolute top-0 right-7 z-20 h-9 w-12 -translate-y-[58%] object-contain sm:right-8 sm:h-10 sm:w-14"
    />
  );
}

function TerminalResizer() {
  const { terminalHeight, setTerminalHeight } = useWorkspace();
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = terminalHeight;
    setDragging(true);
    const onMove = (ev: PointerEvent) => setTerminalHeight(startH - (ev.clientY - startY));
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize terminal"
      className="absolute inset-x-0 -top-1 z-30 hidden h-2 cursor-row-resize md:block"
    >
      <div
        className={cn(
          "h-px w-full transition-colors",
          dragging ? "bg-primary/60" : "bg-transparent hover:bg-primary/40",
        )}
      />
    </div>
  );
}

interface Line {
  type: "input" | "output" | "system" | "assistant";
  text: string;
}

const PROMPT = "klodi@dev";

const ASK_SUGGESTIONS = [
  "What's your strongest area?",
  "Are you open to remote roles?",
  "Which project best shows your backend skills?",
];

const HELP = [
  "Available commands:",
  "  ask <q>     — ask the AI about Klodiana ✦",
  "  whoami      — who am I",
  "  skills      — my tech stack",
  "  projects    — list projects",
  "  contact     — how to reach me",
  "  download-cv — download my CV",
  "  hire        — run hire-me.sh",
  "  clear       — clear the terminal",
];

function runCommand(cmd: string, openFile: (id: string) => void): Line[] {
  const c = cmd.trim().toLowerCase();
  switch (c) {
    case "":
      return [];
    case "help":
      return HELP.map((text) => ({ type: "output", text }));
    case "whoami":
      return [
        { type: "output", text: "Klodiana Mazrekaj — Full Stack Software Engineer" },
        { type: "output", text: "Frontend architecture · real-time systems · automation" },
      ];
    case "skills":
      return [
        { type: "output", text: "frontend  → Next.js, React, TypeScript, Tailwind, Zustand" },
        { type: "output", text: "backend   → Node.js, PHP/Laravel, ASP.NET Core, C#" },
        { type: "output", text: "databases → SQL, PostgreSQL, MongoDB" },
        { type: "output", text: "devops    → Docker, RabbitMQ, Git, Postman" },
      ];
    case "projects":
      return [
        { type: "output", text: "Opening projects/ — pick one from the explorer:" },
        ...Object.values(PROJECTS).map((p) => ({
          type: "output" as const,
          text: `  • ${p.title}`,
        })),
      ];
    case "git log":
    case "git": {
      return [{ type: "output", text: "github → github.com/klodiianamazrekaj" }];
    }
    case "contact": {
      openFile("contact");
      return [
        { type: "output", text: "email    → info@klodi.dev" },
        { type: "output", text: "phone    → +383 49 827 677" },
        { type: "output", text: "linkedin → in/klodiana-mazrekaj" },
        { type: "output", text: "github   → github.com/klodiianamazrekaj" },
        { type: "system", text: "opened contact.md" },
      ];
    }
    case "download-cv":
    case "cv": {
      downloadCv();
      return [
        {
          type: "output",
          text: "downloading CV → CV_KlodianaMazrekaj_FullStack_Software_Engineer.pdf",
        },
      ];
    }
    case "hire": {
      openFile("hire-me");
      return CODE["hire-me"]
        .split("\n")
        .filter((l) => l.startsWith("echo"))
        .map((l) => ({
          type: "output" as const,
          text: l.replace(/^echo\s+"/, "").replace(/"$/, ""),
        }));
    }
    default:
      return [{ type: "output", text: `command not found: ${c} — try 'help'` }];
  }
}

export function TerminalPanel() {
  const {
    openFile,
    terminalOpen,
    setTerminalOpen,
    terminalHeight,
    terminalPrefill,
    setTerminalPrefill,
  } = useWorkspace();
  const [history, setHistory] = useState<Line[]>([
    { type: "system", text: "klodi.dev terminal — type 'help', or 'ask' me anything ✦" },
  ]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, terminalOpen]);

  // Command-palette / external "ask" trigger
  useEffect(() => {
    if (!terminalPrefill) return;
    setTerminalOpen(true);
    setValue(terminalPrefill);
    setTerminalPrefill("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [terminalPrefill, setTerminalOpen, setTerminalPrefill]);

  const updateLastAssistant = (text: string) =>
    setHistory((h) => {
      const next = [...h];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].type === "assistant") {
          next[i] = { type: "assistant", text };
          break;
        }
      }
      return next;
    });

  const askAI = async (question: string) => {
    if (busy) return;
    setBusy(true);
    setHistory((h) => [
      ...h,
      { type: "input", text: `ask ${question}` },
      { type: "assistant", text: "" },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok || !res.body) {
        const errText = (await res.text()).trim();
        let msg = errText || "The assistant could not respond right now.";
        if (res.status === 500 && !errText)
          msg =
            "AI is not configured. Add LOVABLE_API_KEY or GEMINI_API_KEY to .env, then restart npm run dev.";
        else if (res.status === 429) msg = "Rate limited — give it a moment, then ask again.";
        else if (res.status === 402)
          msg = "AI credits are paused right now. Reach me directly via contact.md.";
        updateLastAssistant(msg);
        return;
      }

      const text = (await res.text()).trim();
      if (!text) {
        updateLastAssistant("(no response — try rephrasing)");
        return;
      }
      updateLastAssistant(text);
    } catch {
      updateLastAssistant("Could not reach the assistant. Check your connection and retry.");
    } finally {
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (lower === "clear") {
      setHistory([]);
      return;
    }
    if (lower === "ask") {
      setHistory((h) => [
        ...h,
        { type: "input", text: raw },
        {
          type: "output",
          text: "usage: ask <your question> — e.g. ask what's your strongest area?",
        },
      ]);
      return;
    }
    if (lower.startsWith("ask ")) {
      askAI(trimmed.slice(4).trim());
      return;
    }
    setHistory((h) => [...h, { type: "input", text: raw }, ...runCommand(raw, openFile)]);
  };

  if (!terminalOpen) {
    return (
      <div className="relative flex h-9 shrink-0 items-center justify-between border-t bg-panel px-3">
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <TerminalSquare className="size-3.5" /> terminal
        </span>
        <TerminalMascot />
        <button
          onClick={() => setTerminalOpen(true)}
          className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Open terminal"
        >
          <ChevronUp className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex shrink-0 flex-col border-t bg-terminal"
      style={{ height: terminalHeight }}
    >
      <TerminalResizer />
      <TerminalMascot />
      <div className="relative flex h-9 shrink-0 items-center justify-between border-b px-3">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <TerminalSquare className="size-3.5 text-primary" /> terminal
        </span>
        <button
          onClick={() => setTerminalOpen(false)}
          className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Close terminal"
        >
          <X className="size-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="scroll-thin flex-1 cursor-text overflow-y-auto px-3 py-2 font-mono text-[12.5px] leading-relaxed"
      >
        {history.map((l, i) => {
          if (l.type === "assistant") {
            const streaming = busy && i === history.length - 1;
            return (
              <div key={i} className="my-1 flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground/90">
                  {l.text}
                  {streaming && (
                    <span className="ml-0.5 inline-block animate-pulse text-primary">▍</span>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap wrap-break-word",
                l.type === "output" && "text-foreground/80",
                l.type === "system" && "text-syntax-comment italic",
              )}
            >
              {l.type === "input" ? (
                <span>
                  <span className="text-syntax-string">{PROMPT}</span>
                  <span className="text-muted-foreground">:~$ </span>
                  <span className="text-foreground">{l.text}</span>
                </span>
              ) : (
                l.text
              )}
            </div>
          );
        })}

        {history.length <= 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ASK_SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => askAI(q)}
                disabled={busy}
                className="rounded-md border bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80 transition-colors hover:border-ring/40 hover:text-foreground disabled:opacity-50"
              >
                <Sparkles className="mr-1 inline size-3 text-primary" />
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center">
          <span className="text-syntax-string">{PROMPT}</span>
          <span className="text-muted-foreground">:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={value}
            autoFocus
            disabled={busy}
            spellCheck={false}
            autoComplete="off"
            placeholder={busy ? "thinking…" : ""}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit(value);
                setValue("");
              }
            }}
            className="flex-1 bg-transparent text-foreground caret-primary outline-none placeholder:text-muted-foreground/60 disabled:opacity-60"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
