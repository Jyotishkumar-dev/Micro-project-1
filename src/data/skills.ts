import { SkillTier } from "@/types";

export const skillTiers: SkillTier[] = [
  {
    title: "Technologies I Work With",
    subtitle: "Languages, libraries, and frameworks I actively use to build full-stack web applications.",
    skills: [
      { name: "Java", context: "OOP, Core Syntax, Algorithms", highlight: true },
      { name: "JavaScript (ES6+)", context: "Async/Await, Modern APIs, DOM", highlight: true },
      { name: "TypeScript", context: "Type Safety, Interfaces, Component Props", highlight: true },
      { name: "React", context: "Hooks, State Management, Component Architecture", highlight: true },
      { name: "Next.js (App Router)", context: "Server & Client Components, Route Handlers", highlight: true },
      { name: "Tailwind CSS", context: "Responsive Layouts, Custom Themes, Modern UI", highlight: true },
      { name: "HTML5 & CSS3", context: "Semantic Markup, Flexbox, CSS Grid", highlight: false },
      { name: "Node.js", context: "Event-driven Runtime, REST APIs", highlight: true },
      { name: "Express.js", context: "Routing, Middlewares, API Endpoints", highlight: true },
      { name: "PostgreSQL & SQL", context: "Relational Modeling, Basic Queries, Joins", highlight: false },
      { name: "MongoDB", context: "Document Modeling, Basic Aggregations", highlight: false },
      { name: "Git & GitHub", context: "Version Control, Branching, Pull Requests", highlight: true }
    ]
  },
  {
    title: "Tools I Use",
    subtitle: "Everyday developer environment, design tools, and deployment platforms.",
    skills: [
      { name: "VS Code", context: "Primary IDE, Extensions, Snippets", highlight: true },
      { name: "GitHub", context: "Code Repositories, Issue Tracking, Actions", highlight: true },
      { name: "Postman", context: "API Endpoint Testing & Verification", highlight: false },
      { name: "Figma", context: "UI Wireframing, Layout Concepting", highlight: false },
      { name: "Vercel", context: "Frontend & Next.js Deployments", highlight: true },
      { name: "Render", context: "Backend Web Service Hosting", highlight: false }
    ]
  },
  {
    title: "Currently Learning & Exploring",
    subtitle: "Topics and technologies I am actively studying and experimenting with in my free time.",
    skills: [
      { name: "Data Structures & Algorithms", context: "Trees, Graphs, Recursion, Optimization in Java", highlight: true },
      { name: "Backend Architecture", context: "Modular Monoliths, API Security, Performance", highlight: true },
      { name: "AI Tool Integration", context: "Integrating LLM APIs (Gemini/OpenAI) into Web Apps", highlight: true },
      { name: "Database Design & Indexing", context: "Schema Normalization, Query Optimization", highlight: false },
      { name: "System Design Basics", context: "Caching, Load Balancing Fundamentals", highlight: false }
    ]
  }
];
