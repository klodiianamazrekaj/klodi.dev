import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { TitleBar } from "./TitleBar";
import { SidebarContent } from "./Sidebar";
import { TabBar } from "./TabBar";
import { EditorArea } from "./EditorArea";
import { TerminalPanel } from "./TerminalPanel";
import { CommandPalette } from "./CommandPalette";
import { PortfolioThemeInit } from "./PortfolioThemeInit";
import { useWorkspace, loadPersistedLayout } from "@/store/workspace";
import { cn } from "@/lib/utils";

function SidebarResizer() {
  const { sidebarWidth, setSidebarWidth } = useWorkspace();
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sidebarWidth;
    setDragging(true);
    const onMove = (ev: PointerEvent) => setSidebarWidth(startW + (ev.clientX - startX));
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      className="absolute inset-y-0 -right-1 z-30 hidden w-2 cursor-col-resize md:block"
    >
      <div
        className={cn(
          "mx-auto h-full w-px transition-colors",
          dragging ? "bg-primary/60" : "bg-transparent hover:bg-primary/40",
        )}
      />
    </div>
  );
}

export function Workspace() {
  const { theme, setTheme, sidebarOpen, setSidebarOpen, toggleTerminal, sidebarWidth } =
    useWorkspace();

  // Apply initial theme + keyboard shortcut for terminal
  useEffect(() => {
    setTheme(theme);
    loadPersistedLayout();
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <PortfolioThemeInit />
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside
          className="relative hidden shrink-0 border-r md:block"
          style={{ width: sidebarWidth }}
        >
          <SidebarContent />
          <SidebarResizer />
        </aside>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 z-50 w-64 border-r shadow-pop md:hidden"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex min-w-0 flex-1 flex-col">
          <TabBar />
          <div className="min-h-0 flex-1">
            <EditorArea />
          </div>
          <TerminalPanel />
        </main>
      </div>

      <CommandPalette />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "!bg-card !border-border !text-foreground !font-sans !rounded-xl",
            description: "!text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
