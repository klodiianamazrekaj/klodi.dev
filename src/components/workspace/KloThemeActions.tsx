import { Github, Palette } from "lucide-react";
import { KLO_THEME_REPO_URL } from "@/lib/portfolio-theme";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";

export function KloThemeActions() {
  const { isKloNoirRose, toggleKloNoirRose } = usePortfolioTheme();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={toggleKloNoirRose}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/15"
      >
        <Palette className="size-4" />
        {isKloNoirRose ? "Back to Original" : "Try Theme"}
      </button>
      <a
        href={KLO_THEME_REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border bg-secondary/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-ring/40"
      >
        <Github className="size-4" /> View Code
      </a>
    </div>
  );
}
