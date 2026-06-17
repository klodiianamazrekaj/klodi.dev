import { useEffect } from "react";
import { usePortfolioThemeStore } from "@/hooks/usePortfolioTheme";

/** Client-only sync for portfolio theme state after the head bootstrap script runs. */
export function PortfolioThemeInit() {
  const init = usePortfolioThemeStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
