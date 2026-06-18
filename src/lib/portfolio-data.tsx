export interface FileMeta {
  id: string;
  name: string;
  path: string;
  kind: "code" | "project" | "doc" | "pdf" | "git";
}

export type TreeNode =
  | { type: "file"; id: string }
  | { type: "folder"; name: string; children: TreeNode[] };

export const FILES: Record<string, FileMeta> = {
  about: { id: "about", name: "about.ts", path: "klodi.dev/about.ts", kind: "code" },
  experience: {
    id: "experience",
    name: "experience.json",
    path: "klodi.dev/experience.json",
    kind: "code",
  },
  skills: {
    id: "skills",
    name: "skills.config.ts",
    path: "klodi.dev/skills.config.ts",
    kind: "code",
  },
  "vista-isp-platform": {
    id: "vista-isp-platform",
    name: "vista-isp-platform.tsx",
    path: "klodi.dev/projects/vista-isp-platform.tsx",
    kind: "project",
  },
  "infinit-international": {
    id: "infinit-international",
    name: "infinit-international.ts",
    path: "klodi.dev/projects/infinit-international.ts",
    kind: "project",
  },
  "ecoab-plus": {
    id: "ecoab-plus",
    name: "ecoab-plus.ts",
    path: "klodi.dev/projects/ecoab-plus.ts",
    kind: "project",
  },
  "taverna-hyjnesha": {
    id: "taverna-hyjnesha",
    name: "taverna-hyjnesha.ts",
    path: "klodi.dev/projects/taverna-hyjnesha.ts",
    kind: "project",
  },
  "klo-noir-rose": {
    id: "klo-noir-rose",
    name: "klo-noir-rose.ts",
    path: "klodi.dev/projects/klo-noir-rose.ts",
    kind: "project",
  },
  achievements: {
    id: "achievements",
    name: "achievements.md",
    path: "klodi.dev/achievements.md",
    kind: "doc",
  },
  contact: {
    id: "contact",
    name: "contact.md",
    path: "klodi.dev/contact.md",
    kind: "doc",
  },
  "hire-me": {
    id: "hire-me",
    name: "hire-me.sh",
    path: "klodi.dev/hire-me.sh",
    kind: "code",
  },
};

export const TREE: TreeNode[] = [
  { type: "file", id: "about" },
  { type: "file", id: "experience" },
  { type: "file", id: "skills" },
  {
    type: "folder",
    name: "projects",
    children: [
      { type: "file", id: "vista-isp-platform" },
      { type: "file", id: "infinit-international" },
      { type: "file", id: "ecoab-plus" },
      { type: "file", id: "taverna-hyjnesha" },
      { type: "file", id: "klo-noir-rose" },
    ],
  },
  { type: "file", id: "achievements" },
  { type: "file", id: "contact" },
  { type: "file", id: "hire-me" },
];

/* ----------------------------- Code content ----------------------------- */

export const CODE: Record<string, string> = {
  about: `// Welcome to klodi.dev
// Explore my work like you would explore a codebase.

const engineer = {
  name: "Klodiana Mazrekaj",
  role: "Full Stack Software Engineer & Frontend Team Lead",
  builds: [
    "Full-stack web applications",
    "Real time dashboards",
    "Mobile first product experiences",
    "Internal tools for complex business systems",
  ],
  strengths: [
    "Frontend architecture",
    "Backend services, REST APIs, and system integrations",
    "Real time GPS data, fleet tracking, and monitoring systems",
    "Clean UI/UX from Figma to production",
    "Owning features end to end",
  ],
  philosophy:
    "I build products that are clean to use, reliable under pressure, and useful in the real world.",
};

export function intro(): string {
  return "I design and ship full-stack products end to end from polished interfaces and real time dashboards \n to the backend services, APIs, and integrations that power them.";
}

export default engineer;
`,

  experience: `// To learn more, click Download CV in the header.
{
  "company": "Vista ISP",
  "period": "May 2023 - Present",
  "roles": [
    {
      "title": "Full Stack Software Engineer",
      "type": "Full-time",
      "period": "August 2023 - Present",
      "summary": "Building real-time systems for ISP infrastructure, GPS tracking, network monitoring, and internal operational platforms."
    },
    {
      "title": "Full Stack Developer Intern",
      "type": "Internship",
      "period": "May 2023 - August 2023",
      "summary": "Worked on backend APIs, hardware-software communication, and UI improvements for internal tracking systems."
    }
  ],
  "responsibilities": [
    "Built a Node.js server to communicate with Teltonika GPS devices using official protocol documentation",
    "Decoded binary GPS data from Teltonika devices to receive and process real-time vehicle location updates",
    "Integrated Google Maps Platform API to visualize live vehicle movement on interactive maps",
    "Designed and developed UI/UX for real-time fleet tracking dashboards",
    "Built backend services and REST APIs for GPS data ingestion, processing, and delivery to the frontend",
    "Developed real-time OLT/ONU monitoring systems connected to client network devices",
    "Built interfaces that detect and display network issues such as cable faults, signal loss, and internet connectivity problems",
    "Connected live hardware data with internal dashboards used for faster technical diagnosis and support",
    "Owned features from Figma design to frontend, backend integration, testing, and production deployment"
  ],
  "stack": [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PHP",
    "Laravel",
    "MySQL",
    "PostgreSQL",
    "Google Maps API",
    "Teltonika GPS",
    "Docker",
    "Git",
    "Postman",
    "Figma"
  ]
}
`,

  skills: `export const skills = {
  frontend: [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "shadcn/ui",
    "TanStack Query",
    "Zustand",
    "Bootstrap",
    "Inertia.js",
  ],
  backend: [
    "Node.js",
    "PHP",
    "Laravel",
    "Livewire",
    "Filament",
    "CodeIgniter 4",
    "Java",
  ],
  mobile: [
    "React Native",
    "Flutter",
    "Dart",
    "SwiftUI",
    "Nativewind",
  ],
  databases: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
  ],
  ormAndPlatforms: [
    "Prisma",
    "Supabase",
    "Neon.tech",
    "Firebase",
  ],
  authentication: [
    "JWT",
    "Clerk",
    "Auth.js",
    "Firebase Auth",
  ],
  devopsAndDeployment: [
    "Docker",
    "CI/CD",
    "Vercel",
    "Netlify",
    "Railway",
    "Hostinger",
    "Git",
    "GitHub",
  ],
  apiIntegration: [
    "REST APIs",
    "Google Maps Platform API",
    "Real-Time GPS Data Ingestion",
    "OpenAI API",
    "Gemini API",
    "WebSocket",
  ],
  tools: [
    "Postman",
    "Jira",
    "Figma",
    "Composer",
    "NPM",
    "Bun",
  ],
  testing: [
    "Selenium",
    "Pest",
    "Jest",
    "React Testing Library",
    "Postman API Testing",
  ],
  productDesign: [
    "UI/UX",
    "Responsive Design",
    "Workflow Automation",
    "Full Feature Ownership",
    "Production Deployment",
  ],
  specializedSystems: [
    "Real-Time Dashboards",
    "Fleet & Vehicle Tracking Systems",
    "Network Monitoring Systems",
    "OLT/ONU Infrastructure",
    "Data Visualization",
  ],
  ai: [
    "OpenAI API",
    "Gemini API",
    "Prompt Engineering",
    "AI-Powered Automation",
  ],
} as const;

export type SkillGroup = keyof typeof skills;

// Strongest with end-to-end product work:
// frontend architecture -> real-time data -> backend & automation.
`,

  "hire-me": `#!/usr/bin/env bash

echo "Initializing candidate..."
echo "Name: Klodiana Mazrekaj"
echo "Role: Full Stack Software Engineer"
echo "Loading strengths..."
echo "- Frontend architecture"
echo "- Backend services, REST APIs, and real-time data integrations"
echo "- GPS tracking systems with live Google Maps visualization"
echo "- Hardware-to-dashboard systems for ISP and fleet operations"
echo "- Clean UI/UX with full ownership from Figma to production"
echo "Result: Strong match for teams building real impactful products"
echo "Status: Available for the right opportunity"

# Run: ./hire-me.sh
`,
};

/* ----------------------------- Achievements ----------------------------- */

export const ACHIEVEMENTS = [
  "Took GPS tracking from Teltonika device protocols all the way to live map views",
  "Parsed binary Teltonika payloads into real-time vehicle location updates",
  "Built OLT/ONU monitoring tools that surfaced cable faults, signal loss, and outages for ISP clients",
  "Turned raw hardware telemetry into dashboards the support team used daily",
  "Owned features end to end: Figma designs, APIs, UI, testing, and production rollout",
  "Building this portfolio from scratch",
] as const;

/* ----------------------------- Resume content ----------------------------- */

export const RESUME_MD = `# Klodiana Mazrekaj

Full Stack Software Engineer

## Profile
Full Stack Software Engineer with experience building real-world web applications, internal dashboards, backend integrations, automation tools, and clean user interfaces. Strong focus on frontend architecture, problem-solving, and building useful products.

## Skills
Frontend: Next.js, React, TypeScript, Tailwind CSS, Zustand
Backend: Node.js, PHP/Laravel, ASP.NET Core, C#
Databases: SQL, PostgreSQL, MongoDB
Tools: Docker, RabbitMQ, Git, Postman
Design/Product: Figma, UI/UX, workflow automation

## Experience
### Full Stack / Web Developer
ISP Company

- Built and maintained internal management systems
- Developed dashboards and real-time data interfaces
- Integrated backend APIs
- Worked with databases and internal automation tools
- Improved workflows and reduced manual work

## Projects
### Vista ISP Platform
Internal ISP management platform with dashboards, customer/service management, backend integrations, and automation features.

### Auto Auction Microservices
Online car auction platform using Next.js, .NET, RabbitMQ, PostgreSQL, MongoDB, IdentityServer, and Docker.

### Drita Islame
Islamic app/website concept focused on duas, dhikr, abdes, Islamic learning, and clean spiritual UI.

## Contact
Email: info@klodi.dev
Phone: +383 49 827 677
LinkedIn: in/klodiana-mazrekaj
GitHub: github.com/klodiianamazrekaj
`;

export type FeatureStatus = "done" | "in-progress" | "planned";

export interface Feature {
  label: string;
  status: FeatureStatus;
}

export type ProjectStatus = "live" | "ongoing" | "concept" | "private";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  status: ProjectStatus;
  type?: string;
  confidentiality?: string;
  stack: string[];
  features: Feature[];
  links: { project: string | null; code: string | null };
}

export const PROJECTS: Record<string, Project> = {
  "vista-isp-platform": {
    id: "vista-isp-platform",
    title: "Vista ISP Internal Platform",
    tagline: "Real-time ISP monitoring and GPS tracking systems",
    description:
      "An internal company platform built for real-time ISP infrastructure monitoring, GPS tracking, and operational diagnostics. The system connects live hardware data from GPS devices and client network equipment to internal dashboards used by technical teams to detect issues faster and monitor field operations.",
    role: "Full Stack Software Engineer",
    type: "Internal Company Project",
    year: "2023 - Present",
    status: "private",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PHP",
      "Laravel",
      "MySQL",
      "PostgreSQL",
      "Google Maps Platform API",
      "Teltonika GPS",
      "Postman",
      "Git",
      "Figma",
    ],
    features: [
      { label: "Node.js server communicating with Teltonika GPS devices", status: "done" },
      {
        label: "Binary GPS data decoding based on official Teltonika protocol documentation",
        status: "done",
      },
      { label: "Real-time vehicle movement visualization with Google Maps API", status: "done" },
      { label: "UI/UX for live fleet tracking dashboards", status: "done" },
      { label: "Backend APIs for GPS data ingestion and frontend delivery", status: "done" },
      { label: "OLT/ONU monitoring for client network devices", status: "done" },
      {
        label: "Real-time detection of cable faults, signal loss, and internet connectivity issues",
        status: "done",
      },
      { label: "Internal dashboards for faster technical diagnosis and support", status: "done" },
    ],
    confidentiality:
      "Source code and live access are private because this is an internal company system.",
    links: { project: null, code: null },
  },
  "infinit-international": {
    id: "infinit-international",
    title: "Infinit International",
    tagline: "Client marketing website with entry submission and ongoing management platform",
    description:
      "A live client project for Infinit International, currently built as a modern marketing website with an entry submission flow. The project is still evolving into a full platform with authentication, entry management, and an internal dashboard for handling submitted data.",
    role: "Full Stack Developer",
    type: "Client Project",
    year: "2026",
    status: "live",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Web3Forms",
      "Zustand",
      "TanStack Query",
      "Google Auth",
      "Apple Auth",
    ],
    features: [
      { label: "Public marketing website", status: "done" },
      { label: "Entry submission flow with Web3Forms", status: "done" },
      { label: "Responsive design for desktop and mobile", status: "done" },
      { label: "Modern component-based UI with shadcn/ui", status: "done" },
      { label: "Authentication with Google and Apple sign-in", status: "in-progress" },
      { label: "Management platform for submitted entries", status: "in-progress" },
      { label: "Server-state handling with TanStack Query", status: "in-progress" },
      { label: "Dashboard views for reviewing entry data", status: "planned" },
    ],
    links: { project: "https://infinitinternational.com", code: null },
  },
  "ecoab-plus": {
    id: "ecoab-plus",
    title: "ECOAB Plus",
    tagline: "Urgent client marketing website delivered overnight",
    description:
      "A live client marketing website built under an urgent deadline for a European Union project presentation. The project included the full setup process, from domain purchase and business email configuration to website development, responsive UI, and production launch.",
    role: "Full Stack Developer",
    type: "Client Project",
    year: "2026",
    status: "live",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    features: [
      { label: "Public marketing website", status: "done" },
      { label: "Responsive design for desktop and mobile", status: "done" },
      { label: "Modern component-based UI with shadcn/ui", status: "done" },
      {
        label: "Created the custom 3D render hero image used in the main landing section",
        status: "done",
      },
      { label: "Domain purchase and production setup", status: "done" },
      { label: "Business email configuration", status: "done" },
      { label: "Website prepared for European Union project presentation", status: "done" },
      { label: "Full overnight delivery from setup to launch", status: "done" },
    ],
    links: { project: "https://ecoab-plus.com", code: null },
  },
  "taverna-hyjnesha": {
    id: "taverna-hyjnesha",
    title: "Taverna Hyjnesha",
    tagline: "Restaurant marketing website with menu showcase and reservation flow",
    description:
      "A live client project for Taverna Hyjnesha, built as a modern restaurant marketing website with a menu showcase and reservation modal. The website presents the restaurant’s brand, atmosphere, and offerings in a polished way while making it easy for visitors to explore the menu and request a table.",
    role: "Full Stack Developer",
    type: "Client Project",
    year: "2026",
    status: "live",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
    features: [
      { label: "Public restaurant marketing website", status: "done" },
      { label: "Menu showcase with categorized dishes", status: "done" },
      { label: "Reservation modal for table requests", status: "done" },
      { label: "Responsive mobile-first design", status: "done" },
      { label: "Restaurant brand and atmosphere presentation", status: "done" },
      { label: "Smooth UI animations and interactions", status: "done" },
    ],
    links: { project: "https://tavernahyjnesha.com", code: null },
  },
  "klo-noir-rose": {
    id: "klo-noir-rose",
    title: "Klo Noir Rose",
    tagline: "Custom Cursor theme with an interactive portfolio preview for personal use",
    description:
      "A custom dark theme for Cursor and VS Code, designed with soft plum-black backgrounds, neon rose highlights, and glowing gold syntax. The project is showcased directly inside the portfolio, allowing visitors to preview the theme by applying it to the whole website.",
    role: "Theme Designer & Developer",
    type: "Personal Project",
    year: "2026",
    status: "live",
    stack: [
      "VS Code Theme API",
      "JSON",
      "Cursor",
      "Open VSX-ready",
      "GitHub",
      "CSS Variables",
      "React",
    ],
    features: [
      { label: "Custom Cursor / VS Code color theme", status: "done" },
      { label: "Neon rose and gold syntax palette", status: "done" },
      { label: "Packaged as a VSIX extension", status: "done" },
      { label: "GitHub source code available", status: "done" },
      { label: "Interactive portfolio theme preview", status: "done" },
      { label: "Toggle back to original portfolio theme", status: "done" },
    ],
    links: {
      project: "https://github.com/klodiianamazrekaj/klo-theme",
      code: "https://github.com/klodiianamazrekaj/klo-theme",
    },
  },
};

/* ----------------------------- File icon tints ----------------------------- */

export function fileTint(name: string): string {
  if (name.endsWith(".config.ts")) return "text-syntax-keyword";
  if (name.endsWith(".tsx")) return "text-syntax-prop";
  if (name.endsWith(".ts")) return "text-syntax-fn";
  if (name.endsWith(".json")) return "text-syntax-type";
  if (name.endsWith(".dart")) return "text-primary";
  if (name.endsWith(".md")) return "text-muted-foreground";
  if (name.endsWith(".sh")) return "text-syntax-string";
  if (name.endsWith(".pdf")) return "text-syntax-keyword";
  if (name.endsWith(".git")) return "text-primary";
  return "text-muted-foreground";
}
