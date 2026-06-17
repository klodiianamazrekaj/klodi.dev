import { ACHIEVEMENTS, CODE, PROJECTS } from "@/lib/portfolio-data";

export const PORTFOLIO_CONTACT = {
  email: "info@klodi.dev",
  phone: "+383 49 827 677",
  linkedin: "https://www.linkedin.com/in/klodiana-mazrekaj/",
  github: "https://github.com/klodiianamazrekaj",
} as const;

export function buildPortfolioAssistantContext(): string {
  const projects = Object.values(PROJECTS)
    .map(
      (p) => `### ${p.title} (${p.year})
Role: ${p.role}
Type: ${p.type ?? "Project"}
Status: ${p.status}
Tagline: ${p.tagline}
Description: ${p.description}
Stack: ${p.stack.join(", ")}
Features: ${p.features.map((f) => `${f.label} [${f.status}]`).join("; ")}
Links: project=${p.links.project ?? "private"}, code=${p.links.code ?? "private"}`,
    )
    .join("\n\n");

  const achievements = ACHIEVEMENTS.map((item) => `- ${item}`).join("\n");

  return `# Portfolio source files (only use this information)

## about.ts
${CODE.about}

## experience.json
${CODE.experience}

## skills.config.ts
${CODE.skills}

## achievements.md
${achievements}

## projects/
${projects}

## contact.md
Email: ${PORTFOLIO_CONTACT.email}
Phone: ${PORTFOLIO_CONTACT.phone}
LinkedIn: ${PORTFOLIO_CONTACT.linkedin}
GitHub: ${PORTFOLIO_CONTACT.github}

## availability
Klodiana is open to full-stack engineering roles, including remote.`;
}
