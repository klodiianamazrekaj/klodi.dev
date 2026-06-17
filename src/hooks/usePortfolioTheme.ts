import { create } from "zustand";
import {
  applyPortfolioTheme,
  KLO_NOIR_ROSE_THEME_ID,
  readStoredPortfolioTheme,
  type PortfolioThemeId,
} from "@/lib/portfolio-theme";

interface PortfolioThemeState {
  themeId: PortfolioThemeId;
  ready: boolean;
  init: () => void;
  setPortfolioTheme: (themeId: PortfolioThemeId) => void;
  tryKloNoirRose: () => void;
  resetTheme: () => void;
  toggleKloNoirRose: () => void;
}

export const usePortfolioThemeStore = create<PortfolioThemeState>((set, get) => ({
  themeId: "default",
  ready: false,

  init: () => {
    if (get().ready) return;
    const stored = readStoredPortfolioTheme();
    applyPortfolioTheme(stored);
    set({ themeId: stored, ready: true });
  },

  setPortfolioTheme: (themeId) => {
    applyPortfolioTheme(themeId);
    set({ themeId });
  },

  tryKloNoirRose: () => {
    get().setPortfolioTheme(KLO_NOIR_ROSE_THEME_ID);
  },

  resetTheme: () => {
    get().setPortfolioTheme("default");
  },

  toggleKloNoirRose: () => {
    const { themeId, setPortfolioTheme } = get();
    setPortfolioTheme(themeId === KLO_NOIR_ROSE_THEME_ID ? "default" : KLO_NOIR_ROSE_THEME_ID);
  },
}));

export function usePortfolioTheme() {
  const themeId = usePortfolioThemeStore((s) => s.themeId);
  const ready = usePortfolioThemeStore((s) => s.ready);
  const setPortfolioTheme = usePortfolioThemeStore((s) => s.setPortfolioTheme);
  const tryKloNoirRose = usePortfolioThemeStore((s) => s.tryKloNoirRose);
  const resetTheme = usePortfolioThemeStore((s) => s.resetTheme);
  const toggleKloNoirRose = usePortfolioThemeStore((s) => s.toggleKloNoirRose);

  return {
    themeId,
    ready,
    isKloNoirRose: themeId === KLO_NOIR_ROSE_THEME_ID,
    setPortfolioTheme,
    tryKloNoirRose,
    resetTheme,
    toggleKloNoirRose,
  };
}
