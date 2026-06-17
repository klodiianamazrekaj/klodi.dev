import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Command, Download, Menu, Moon, Sun, Circle } from "lucide-react";
import { CV_PDF_FILENAME, CV_PDF_PATH } from "@/lib/cv";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/store/workspace";

export function TitleBar() {
  const { theme, toggleTheme, setPaletteOpen, setSidebarOpen, sidebarOpen, activeTab, sidebarWidth } =
    useWorkspace();
  const [cvAttention, setCvAttention] = useState(false);

  useEffect(() => {
    if (activeTab !== "experience") return;

    setCvAttention(true);
    const timer = window.setTimeout(() => setCvAttention(false), 1800);
    return () => window.clearTimeout(timer);
  }, [activeTab]);

  return (
    <header className="flex h-11 shrink-0 border-b bg-titlebar">
      <div
        className="hidden shrink-0 items-center gap-2 border-r px-3 md:flex"
        style={{ width: sidebarWidth }}
        aria-hidden
      >
        <span className="size-3 rounded-full bg-destructive/80" />
        <span className="size-3 rounded-full bg-syntax-number/80" />
        <span className="size-3 rounded-full bg-syntax-string/80" />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Toggle file explorer"
        >
          <Menu className="size-4" />
        </button>

        <motion.a
          href={CV_PDF_PATH}
          download={CV_PDF_FILENAME}
          animate={
            cvAttention
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary) / 0)",
                    "0 0 0 4px hsl(var(--primary) / 0.3)",
                    "0 0 0 0 hsl(var(--primary) / 0)",
                  ],
                }
              : { scale: 1, boxShadow: "0 0 0 0 transparent" }
          }
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors sm:inline-flex",
            cvAttention
              ? "border-primary/60 bg-primary/15 text-primary"
              : "bg-secondary/60 text-muted-foreground hover:border-ring/40 hover:text-foreground",
          )}
        >
          <Download className="size-3" />
          Download CV
        </motion.a>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <Circle className="size-2 shrink-0 fill-primary text-primary" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            klodi.dev — workspace
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-md border bg-secondary/60 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground sm:flex"
          >
            <Command className="size-3" />
            <span>K</span>
          </button>
          <button
            onClick={toggleTheme}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </motion.span>
          </button>
        </div>
      </div>
    </header>
  );
}
