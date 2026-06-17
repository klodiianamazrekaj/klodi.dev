import { create } from "zustand";

export type Theme = "dark" | "light";

interface WorkspaceState {
  theme: Theme;
  openTabs: string[];
  activeTab: string | null;
  paletteOpen: boolean;
  sidebarOpen: boolean; // mobile drawer
  terminalOpen: boolean;
  sidebarWidth: number;
  terminalHeight: number;
  terminalPrefill: string;

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActive: (id: string) => void;
  setPaletteOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  toggleTerminal: () => void;
  setTerminalOpen: (v: boolean) => void;
  setSidebarWidth: (w: number) => void;
  setTerminalHeight: (h: number) => void;
  setTerminalPrefill: (v: string) => void;
}

const DEFAULT_FILE = "about";

export const SIDEBAR_MIN = 220;
export const SIDEBAR_MAX = 420;
export const SIDEBAR_DEFAULT = 256;
export const TERMINAL_MIN = 120;
export const TERMINAL_DEFAULT = 208;

const SIDEBAR_KEY = "ws:sidebarWidth";
const TERMINAL_KEY = "ws:terminalHeight";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function terminalMax() {
  return typeof window !== "undefined" ? window.innerHeight * 0.5 : 480;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  theme: "dark",
  openTabs: [DEFAULT_FILE],
  activeTab: DEFAULT_FILE,
  paletteOpen: false,
  sidebarOpen: false,
  terminalOpen: true,
  sidebarWidth: SIDEBAR_DEFAULT,
  terminalHeight: TERMINAL_DEFAULT,
  terminalPrefill: "",

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },

  openFile: (id) =>
    set((s) => ({
      openTabs: s.openTabs.includes(id) ? s.openTabs : [...s.openTabs, id],
      activeTab: id,
      sidebarOpen: false,
    })),

  closeFile: (id) =>
    set((s) => {
      const tabs = s.openTabs.filter((t) => t !== id);
      let active = s.activeTab;
      if (s.activeTab === id) {
        const idx = s.openTabs.indexOf(id);
        active = tabs[idx] ?? tabs[idx - 1] ?? tabs[tabs.length - 1] ?? null;
      }
      return { openTabs: tabs, activeTab: active };
    }),

  setActive: (id) => set({ activeTab: id }),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),
  setTerminalOpen: (terminalOpen) => set({ terminalOpen }),
  setTerminalPrefill: (terminalPrefill) => set({ terminalPrefill }),

  setSidebarWidth: (w) => {
    const clamped = clamp(w, SIDEBAR_MIN, SIDEBAR_MAX);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SIDEBAR_KEY, String(clamped));
    }
    set({ sidebarWidth: clamped });
  },
  setTerminalHeight: (h) => {
    const clamped = clamp(h, TERMINAL_MIN, terminalMax());
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TERMINAL_KEY, String(clamped));
    }
    set({ terminalHeight: clamped });
  },
}));

export function loadPersistedLayout() {
  if (typeof window === "undefined") return;
  const { setSidebarWidth, setTerminalHeight } = useWorkspace.getState();
  const sw = window.localStorage.getItem(SIDEBAR_KEY);
  if (sw) setSidebarWidth(parseFloat(sw));
  const th = window.localStorage.getItem(TERMINAL_KEY);
  if (th) setTerminalHeight(parseFloat(th));
}
