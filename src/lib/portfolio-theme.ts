import { kloNoirRoseTheme } from "@/themes/kloNoirRose";

export const PORTFOLIO_THEME_STORAGE_KEY = "portfolio-theme";

export const KLO_NOIR_ROSE_THEME_ID = kloNoirRoseTheme.id;

export type PortfolioThemeId = "default" | typeof KLO_NOIR_ROSE_THEME_ID;

export const KLO_THEME_REPO_URL = "https://github.com/klodiianamazrekaj/klo-theme";

export function readStoredPortfolioTheme(): PortfolioThemeId {
  if (typeof window === "undefined") return "default";
  try {
    return localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY) === KLO_NOIR_ROSE_THEME_ID
      ? KLO_NOIR_ROSE_THEME_ID
      : "default";
  } catch {
    return "default";
  }
}

export function applyPortfolioTheme(themeId: PortfolioThemeId) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (themeId === KLO_NOIR_ROSE_THEME_ID) {
    root.setAttribute("data-theme", KLO_NOIR_ROSE_THEME_ID);
  } else {
    root.removeAttribute("data-theme");
  }

  try {
    localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, themeId);
  } catch {
    // ignore quota / private mode
  }
}

/** Inline script for <head> — runs before paint to avoid theme flash. */
export const PORTFOLIO_THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(PORTFOLIO_THEME_STORAGE_KEY)};var id=${JSON.stringify(KLO_NOIR_ROSE_THEME_ID)};if(localStorage.getItem(k)===id){document.documentElement.setAttribute("data-theme",id);}}catch(e){}})();`;
