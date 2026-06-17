import { createServerFn } from "@tanstack/react-start";

export const GITHUB_USERNAME = "klodiianamazrekaj";

export interface GitRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
}

export interface GitEvent {
  id: string;
  type: "commit" | "pr" | "issue" | "create" | "star" | "other";
  repo: string;
  message: string;
  url: string;
  createdAt: string;
}

export interface GitActivity {
  username: string;
  profileUrl: string;
  repoCount: number;
  totalStars: number;
  topLanguages: string[];
  repos: GitRepo[];
  events: GitEvent[];
  error?: string;
}

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "klodi.dev-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function describeEvent(ev: any): GitEvent | null {
  const repo: string = ev?.repo?.name ?? "";
  const base = `https://github.com/${repo}`;
  switch (ev?.type) {
    case "PushEvent": {
      const commits = ev?.payload?.commits ?? [];
      const last = commits[commits.length - 1];
      const count = commits.length;
      return {
        id: ev.id,
        type: "commit",
        repo,
        message: last?.message?.split("\n")[0] ?? `${count} commit(s)`,
        url: base,
        createdAt: ev.created_at,
      };
    }
    case "PullRequestEvent":
      return {
        id: ev.id,
        type: "pr",
        repo,
        message: `${ev.payload?.action ?? "updated"} PR: ${ev.payload?.pull_request?.title ?? ""}`.trim(),
        url: ev.payload?.pull_request?.html_url ?? base,
        createdAt: ev.created_at,
      };
    case "IssuesEvent":
      return {
        id: ev.id,
        type: "issue",
        repo,
        message: `${ev.payload?.action ?? "updated"} issue: ${ev.payload?.issue?.title ?? ""}`.trim(),
        url: ev.payload?.issue?.html_url ?? base,
        createdAt: ev.created_at,
      };
    case "CreateEvent":
      return {
        id: ev.id,
        type: "create",
        repo,
        message: `created ${ev.payload?.ref_type ?? "repo"}${ev.payload?.ref ? ` ${ev.payload.ref}` : ""}`,
        url: base,
        createdAt: ev.created_at,
      };
    case "WatchEvent":
      return { id: ev.id, type: "star", repo, message: `starred ${repo}`, url: base, createdAt: ev.created_at };
    default:
      return null;
  }
}

const EMPTY = (error: string): GitActivity => ({
  username: GITHUB_USERNAME,
  profileUrl: `https://github.com/${GITHUB_USERNAME}`,
  repoCount: 0,
  totalStars: 0,
  topLanguages: [],
  repos: [],
  events: [],
  error,
});

export const getGitActivity = createServerFn({ method: "GET" }).handler(
  async (): Promise<GitActivity> => {
    try {
      const [reposRes, eventsRes] = await Promise.all([
        fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
          { headers: ghHeaders() },
        ),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`, {
          headers: ghHeaders(),
        }),
      ]);

      if (!reposRes.ok) {
        return EMPTY(reposRes.status === 404 ? "GitHub user not found" : "GitHub is unavailable");
      }

      const reposRaw: any[] = await reposRes.json();
      const eventsRaw: any[] = eventsRes.ok ? await eventsRes.json() : [];

      const owned = reposRaw.filter((r) => !r.fork);
      const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

      const langCount: Record<string, number> = {};
      for (const r of owned) {
        if (r.language) langCount[r.language] = (langCount[r.language] ?? 0) + 1;
      }
      const topLanguages = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([l]) => l);

      const repos: GitRepo[] = owned
        .slice()
        .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
        .slice(0, 6)
        .map((r) => ({
          name: r.name,
          description: r.description ?? null,
          language: r.language ?? null,
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
          url: r.html_url,
          updatedAt: r.updated_at,
        }));

      const events: GitEvent[] = eventsRaw
        .map(describeEvent)
        .filter((e): e is GitEvent => e !== null)
        .slice(0, 12);

      return {
        username: GITHUB_USERNAME,
        profileUrl: `https://github.com/${GITHUB_USERNAME}`,
        repoCount: owned.length,
        totalStars,
        topLanguages,
        repos,
        events,
      };
    } catch (err) {
      console.error("getGitActivity error", err);
      return EMPTY("Could not reach GitHub");
    }
  },
);
