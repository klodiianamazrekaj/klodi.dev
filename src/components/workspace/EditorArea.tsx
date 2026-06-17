import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  Circle,
  CircleDot,
  Loader,
  RefreshCw,
} from "lucide-react";
import { CodeBlock } from "@/lib/highlight";
import {
  ACHIEVEMENTS,
  CODE,
  FILES,
  PROJECTS,
  type Feature,
  type FeatureStatus,
  type Project,
  type ProjectStatus,
} from "@/lib/portfolio-data";
import { getGitActivity, type GitEvent } from "@/lib/github.functions";
import { cn } from "@/lib/utils";
import { KloThemeActions } from "@/components/workspace/KloThemeActions";
import { useWorkspace } from "@/store/workspace";

function Breadcrumb({ path }: { path: string }) {
  const parts = path.split("/");
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b bg-editor px-4 py-2 font-mono text-[11px] text-muted-foreground scroll-thin">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1 whitespace-nowrap">
          {i > 0 && <ChevronRight className="size-3 opacity-50" />}
          <span className={i === parts.length - 1 ? "text-foreground" : ""}>{p}</span>
        </span>
      ))}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border bg-secondary/60 px-2.5 py-1 font-mono text-[11.5px] text-foreground/80">
      {children}
    </span>
  );
}

const FEATURE_META: Record<
  FeatureStatus,
  { label: string; icon: typeof CheckCircle2; iconClass: string; pillClass: string }
> = {
  done: {
    label: "Done",
    icon: CheckCircle2,
    iconClass: "text-primary",
    pillClass: "border-primary/30 bg-primary/10 text-primary",
  },
  "in-progress": {
    label: "In progress",
    icon: Loader,
    iconClass: "text-amber-400",
    pillClass: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  planned: {
    label: "Planned",
    icon: Circle,
    iconClass: "text-muted-foreground",
    pillClass: "border-border bg-secondary/40 text-muted-foreground",
  },
};

function FeatureRow({ feature }: { feature: Feature }) {
  const meta = FEATURE_META[feature.status];
  const Icon = meta.icon;

  return (
    <li className="flex items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 items-start gap-2.5">
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            meta.iconClass,
            feature.status === "in-progress" && "animate-spin",
          )}
        />
        <span
          className={cn(
            "text-sm",
            feature.status === "planned" ? "text-muted-foreground" : "text-foreground/85",
          )}
        >
          {feature.label}
        </span>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
          meta.pillClass,
        )}
      >
        {meta.label}
      </span>
    </li>
  );
}

const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  live: {
    label: "Live",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  ongoing: {
    label: "Ongoing",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  concept: {
    label: "Concept",
    className: "border-border bg-secondary/40 text-muted-foreground",
  },
  private: {
    label: "Private",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = PROJECT_STATUS_META[status];
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

function ProjectView({ p }: { p: Project }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            {`// project · ${p.year}`}
          </p>
          <ProjectStatusBadge status={p.status} />
        </div>
        {p.links.project && (
          <a
            href={p.links.project}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            View Project <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-2 font-mono text-sm text-muted-foreground">{p.tagline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Code2 className="size-3.5 text-primary" /> {p.role}
        </span>
        {p.type && (
          <>
            <span className="text-foreground/20">·</span>
            <span>{p.type}</span>
          </>
        )}
        {p.links.code && (
          <>
            <span className="text-foreground/20">·</span>
            <a
              href={p.links.code}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-foreground/80 underline-offset-2 transition-colors hover:text-primary hover:underline"
            >
              <Github className="size-3.5" /> View Code
            </a>
          </>
        )}
      </div>

      <p className="mt-6 max-w-2xl leading-relaxed text-foreground/85">{p.description}</p>

      {p.confidentiality && (
        <p className="mt-4 max-w-2xl rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
          {p.confidentiality}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>

      {p.id === "klo-noir-rose" && <KloThemeActions />}

      <div className="mt-8 rounded-xl border bg-card/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Key features
          </h2>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground">
            {(Object.keys(FEATURE_META) as FeatureStatus[]).map((status) => {
              const meta = FEATURE_META[status];
              const LegendIcon = meta.icon;
              return (
                <span key={status} className="flex items-center gap-1">
                  <LegendIcon
                    className={cn(
                      "size-3",
                      meta.iconClass,
                      status === "in-progress" && "animate-spin",
                    )}
                  />
                  {status}
                </span>
              );
            })}
          </div>
        </div>
        <ul className="mt-3 grid gap-2.5">
          {p.features.map((f) => (
            <FeatureRow key={f.label} feature={f} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function AchievementsView() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
        # achievements
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Highlights</h1>
      <p className="mt-2 text-muted-foreground">A few things I am genuinely proud of building.</p>
      <div className="mt-8 grid gap-3">
        {ACHIEVEMENTS.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-3 rounded-xl border bg-card/60 p-4"
          >
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-sm text-foreground/90">{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group rounded-xl border bg-card/60 p-5 transition-colors hover:border-ring/40"
    >
      <Icon className="size-5 text-primary" />
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1 text-sm text-foreground/90">
        {value}
        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </p>
    </a>
  );
}

function ContactView() {
  const directChannels = [
    {
      icon: Mail,
      label: "Email",
      value: "info@klodi.dev",
      href: "mailto:info@klodi.dev",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+383 49 827 677",
      href: "tel:+38349827677",
    },
  ];

  const socialChannels = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "in/klodiana-mazrekaj",
      href: "https://www.linkedin.com/in/klodiana-mazrekaj/",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/klodiianamazrekaj",
      href: "https://github.com/klodiianamazrekaj",
    },
  ];
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary"># contact</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Let&apos;s build something useful.
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
        Open to roles, collaborations, and interesting problems. The fastest way to reach me is
        below.
      </p>
      <div className="mt-8 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {directChannels.map((c) => (
            <ContactCard key={c.label} {...c} />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {socialChannels.map((c) => (
            <ContactCard key={c.label} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}

const EVENT_ICON: Record<GitEvent["type"], typeof GitCommit> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: CircleDot,
  create: GitBranch,
  star: Star,
  other: GitCommit,
};

function relTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

function GitActivityView() {
  const fetchActivity = useServerFn(getGitActivity);
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["git-activity"],
    queryFn: () => fetchActivity(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            # source control · live
          </p>
          <h1 className="mt-3 flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            <GitBranch className="size-7 text-primary" /> Live activity
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pulled in real time from GitHub — not a screenshot.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border bg-secondary/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
          aria-label="Refresh activity"
        >
          <RefreshCw className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} /> refresh
        </button>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border bg-card/40" />
          ))}
        </div>
      )}

      {!isLoading && (isError || data?.error) && (
        <div className="mt-8 rounded-xl border bg-card/60 p-6 text-sm text-muted-foreground">
          {data?.error ?? "Could not reach GitHub right now."} You can still browse my work on{" "}
          <a
            href={data?.profileUrl ?? "https://github.com/klodiianamazrekaj"}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            GitHub
          </a>
          .
        </div>
      )}

      {!isLoading && data && !data.error && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card/60 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Public repos
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{data.repoCount}</p>
            </div>
            <div className="rounded-xl border bg-card/60 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Total stars
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold tabular-nums">
                <Star className="size-5 text-primary" /> {data.totalStars}
              </p>
            </div>
            <div className="rounded-xl border bg-card/60 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Top languages
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {data.topLanguages.length ? (
                  data.topLanguages.slice(0, 4).map((l) => <Chip key={l}>{l}</Chip>)
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>

          {data.events.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Recent commits & activity
              </h2>
              <div className="mt-3 grid gap-2">
                {data.events.map((ev) => {
                  const Icon = EVENT_ICON[ev.type];
                  return (
                    <a
                      key={ev.id}
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-3 rounded-xl border bg-card/60 p-3.5 transition-colors hover:border-ring/40"
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground/90">{ev.message}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {ev.repo} · {relTime(ev.createdAt)}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {data.repos.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Top repositories
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {data.repos.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-xl border bg-card/60 p-4 transition-colors hover:border-ring/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-mono text-sm text-foreground/90">{r.name}</p>
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    {r.description && (
                      <p className="mt-2 line-clamp-2 text-[13px] text-muted-foreground">
                        {r.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                      {r.language && <span>{r.language}</span>}
                      <span className="flex items-center gap-1">
                        <Star className="size-3" /> {r.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="size-3" /> {r.forks}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <a
            href={data.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Github className="size-4" /> View full GitHub profile
          </a>
        </>
      )}
    </div>
  );
}

function FileBody({ id }: { id: string }) {
  const meta = FILES[id];
  if (meta.kind === "project") return <ProjectView p={PROJECTS[id]} />;
  if (id === "achievements") return <AchievementsView />;
  if (id === "contact") return <ContactView />;
  if (id === "github") return <GitActivityView />;
  return (
    <div className="px-3 py-5 sm:px-5">
      <CodeBlock code={CODE[id]} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-muted-foreground">No file open</p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          Open a file from the explorer, or press{" "}
          <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono">⌘K</kbd>
        </p>
      </div>
    </div>
  );
}

export function EditorArea() {
  const { activeTab } = useWorkspace();

  if (!activeTab) return <EmptyState />;
  const meta = FILES[activeTab];

  return (
    <div className="flex h-full flex-col bg-editor">
      <Breadcrumb path={meta.path} />
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="scroll-thin flex-1 overflow-y-auto"
      >
        <FileBody id={activeTab} />
      </motion.div>
    </div>
  );
}
