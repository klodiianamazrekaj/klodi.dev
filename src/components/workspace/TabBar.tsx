import { motion } from "framer-motion";
import { FileCode2, X } from "lucide-react";
import { FILES, fileTint } from "@/lib/portfolio-data";
import { useWorkspace } from "@/store/workspace";
import { cn } from "@/lib/utils";

export function TabBar() {
  const { openTabs, activeTab, setActive, closeFile } = useWorkspace();

  if (openTabs.length === 0) return null;

  return (
    <div className="scroll-thin flex h-10 shrink-0 items-stretch overflow-x-auto border-b bg-tabbar">
      {openTabs.map((id) => {
        const meta = FILES[id];
        const active = activeTab === id;
        return (
          <div
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "group relative flex cursor-pointer items-center gap-2 border-r pl-3 pr-2 font-mono text-[12.5px] transition-colors",
              active
                ? "bg-tab-active text-foreground"
                : "bg-tabbar text-muted-foreground hover:bg-tab-active/60 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="active-tab-underline"
                className="absolute inset-x-0 top-0 h-0.5 bg-primary"
              />
            )}
            <FileCode2 className={cn("size-3.5 shrink-0", fileTint(meta.name))} />
            <span className="whitespace-nowrap">{meta.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(id);
              }}
              className="grid size-5 place-items-center rounded text-muted-foreground/70 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
              aria-label={`Close ${meta.name}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
