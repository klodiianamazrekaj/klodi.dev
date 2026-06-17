import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/workspace/Workspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klodiana Mazrekaj — Full Stack Software Engineer" },
      {
        name: "description",
        content:
          "Klodiana Mazrekaj is a Full Stack Software Engineer specializing in frontend architecture, real-time systems, and automation. Explore the portfolio as a code workspace.",
      },
      { property: "og:title", content: "Klodiana Mazrekaj — Full Stack Software Engineer" },
      {
        property: "og:description",
        content:
          "An interactive code-editor portfolio: files, tabs, terminal, and projects by Klodiana Mazrekaj.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});
