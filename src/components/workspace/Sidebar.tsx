import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Download, FileCode2, Folder, FolderOpen } from "lucide-react";
import { FILES, TREE, fileTint, type TreeNode } from "@/lib/portfolio-data";
import { CV_PDF_FILENAME, CV_PDF_PATH } from "@/lib/cv";
import { useWorkspace } from "@/store/workspace";
import { cn } from "@/lib/utils";

function FileRow({ id, depth }: { id: string; depth: number }) {
  const meta = FILES[id];
  const { activeTab, openFile } = useWorkspace();
  const active = activeTab === id;

  return (
    <button
      onClick={() => openFile(id)}
      style={{ paddingLeft: depth * 14 + 12 }}
      className={cn(
        "group relative flex w-full items-center gap-2 py-1.5 pr-2 text-left font-mono text-[13px] transition-colors",
        active
          ? "bg-active-line text-foreground"
          : "text-sidebar-foreground hover:bg-active-line/50 hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="active-file-rail"
          className="absolute inset-y-0 left-0 w-0.5 bg-primary"
        />
      )}
      <FileCode2 className={cn("size-4 shrink-0", fileTint(meta.name))} />
      <span className="truncate">{meta.name}</span>
    </button>
  );
}

function FolderRow({
  node,
  depth,
}: {
  node: Extract<TreeNode, { type: "folder" }>;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ paddingLeft: depth * 14 + 12 }}
        className="flex w-full items-center gap-1.5 py-1.5 pr-2 text-left font-mono text-[13px] text-sidebar-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight
          className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-90")}
        />
        {open ? (
          <FolderOpen className="size-4 shrink-0 text-syntax-type" />
        ) : (
          <Folder className="size-4 shrink-0 text-syntax-type" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {node.children.map((c) => (
              <NodeRow key={c.type === "file" ? c.id : c.name} node={c} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  if (node.type === "file") return <FileRow id={node.id} depth={depth} />;
  return <FolderRow node={node} depth={depth} />;
}

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Explorer
        </span>
      </div>
      <div className="px-2 pb-1">
        <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70">
          <ChevronRight className="size-3 rotate-90" />
          klodi.dev
        </div>
      </div>
      <nav className="scroll-thin flex-1 overflow-y-auto pb-4">
        {TREE.map((n) => (
          <NodeRow key={n.type === "file" ? n.id : n.name} node={n} depth={1} />
        ))}
      </nav>
      <div className="border-t px-4 py-3">
        <a
          href={CV_PDF_PATH}
          download={CV_PDF_FILENAME}
          className="mb-2 flex items-center gap-2 rounded-md border bg-secondary/60 px-2.5 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground md:hidden"
        >
          <Download className="size-3.5 shrink-0 text-primary" />
          Download CV
        </a>
        <p className="font-mono text-[11px] text-muted-foreground">
          <span className="text-syntax-string">●</span> available for work
        </p>
      </div>
    </div>
  );
}
