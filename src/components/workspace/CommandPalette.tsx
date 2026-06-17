import { useEffect } from "react";
import {
  FileText,
  FolderGit2,
  Mail,
  Briefcase,
  Wrench,
  Palette,
  Download,
  User,
  Sparkles,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { downloadCv } from "@/lib/cv";
import { useWorkspace } from "@/store/workspace";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, openFile, toggleTheme, setTerminalPrefill } = useWorkspace();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const run = (fn: () => void) => {
    fn();
    setPaletteOpen(false);
  };

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Type a command or search files…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => openFile("about"))}>
            <User className="size-4" /> Open About
          </CommandItem>
          <CommandItem onSelect={() => run(() => openFile("experience"))}>
            <Briefcase className="size-4" /> Open Experience
          </CommandItem>
          <CommandItem onSelect={() => run(() => openFile("skills"))}>
            <Wrench className="size-4" /> Open Skills
          </CommandItem>
          <CommandItem onSelect={() => run(() => openFile("vista-isp-platform"))}>
            <FolderGit2 className="size-4" /> Open Projects
          </CommandItem>
          <CommandItem onSelect={() => run(() => openFile("contact"))}>
            <Mail className="size-4" /> Open Contact
          </CommandItem>
          <CommandItem onSelect={() => run(() => openFile("achievements"))}>
            <FileText className="size-4" /> Open Achievements
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => setTerminalPrefill("ask "))}>
            <Sparkles className="size-4" /> Ask the workspace (AI)
          </CommandItem>
          <CommandItem onSelect={() => run(toggleTheme)}>
            <Palette className="size-4" /> Toggle Theme
          </CommandItem>
          <CommandItem onSelect={() => run(downloadCv)}>
            <Download className="size-4" /> Download CV
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
