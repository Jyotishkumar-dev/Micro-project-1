import { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    iconName: "Code2",
    description: "Core languages used for building performant software and algorithm problem solving.",
    skills: [
      { name: "Java", level: "Proficient", featured: true, description: "OOP, Collections, Multi-threading, DSA" },
      { name: "JavaScript (ES6+)", level: "Advanced", featured: true, description: "Async/Await, DOM, Event Loop, Closures" },
      { name: "TypeScript", level: "Proficient", featured: true, description: "Type Safety, Generics, Interfaces, Strict Mode" },
      { name: "Python", level: "Intermediate", featured: false, description: "Data Analysis, Scripting, AI Libraries" },
      { name: "C++", level: "Intermediate", featured: false, description: "Data Structures, Competitive Programming" },
      { name: "SQL", level: "Proficient", featured: true, description: "Relational Queries, Joins, Indexing, Schema Design" }
    ]
  },
  {
    title: "Frontend Development",
    iconName: "Layout",
    description: "Crafting responsive, accessible, high-performance user interfaces.",
    skills: [
      { name: "React", level: "Advanced", featured: true, description: "Hooks, Context API, Custom Hooks, State Management" },
      { name: "Next.js (App Router)", level: "Proficient", featured: true, description: "SSR, SSG, Server Actions, Route Handlers" },
      { name: "Tailwind CSS", level: "Advanced", featured: true, description: "Utility-first CSS, Responsive UI, Custom Animations" },
      { name: "HTML5 & CSS3", level: "Expert", featured: true, description: "Semantic markup, Flexbox, Grid, CSS Variables" },
      { name: "Framer Motion", level: "Proficient", featured: true, description: "Spring Physics, Gesture Animations, Layout Animations" },
      { name: "Vite", level: "Advanced", featured: false, description: "Lightning-fast HMR and build bundling" }
    ]
  },
  {
    title: "Backend & Systems",
    iconName: "Server",
    description: "Architecting reliable server-side microservices, APIs, and authentication pipelines.",
    skills: [
      { name: "Node.js", level: "Proficient", featured: true, description: "Event-driven runtime, NPM ecosystem, Streams" },
      { name: "Express.js", level: "Proficient", featured: true, description: "RESTful architecture, Middlewares, Routing" },
      { name: "RESTful APIs", level: "Advanced", featured: true, description: "API Contract Design, Versioning, Status Codes" },
      { name: "JWT & Multi-Role Auth", level: "Proficient", featured: true, description: "Access/Refresh tokens, RBAC, Bcrypt/Argon2" },
      { name: "PostgreSQL", level: "Proficient", featured: true, description: "Relational modeling, Constraints, Foreign Keys" },
      { name: "Prisma & Drizzle ORM", level: "Proficient", featured: false, description: "Type-safe database migrations & queries" }
    ]
  },
  {
    title: "Database & Storage",
    iconName: "Database",
    description: "Designing data structures and database systems for data integrity and speed.",
    skills: [
      { name: "MongoDB", level: "Proficient", featured: true, description: "NoSQL document stores, Aggregation pipeline" },
      { name: "PostgreSQL", level: "Proficient", featured: true, description: "ACID compliance, Transactions, Optimized Queries" },
      { name: "SQL Fundamentals", level: "Advanced", featured: true, description: "Normalization (1NF-BCNF), Indexing, Subqueries" },
      { name: "Database Design", level: "Proficient", featured: true, description: "ER Diagrams, Relationships, Constraints" }
    ]
  },
  {
    title: "Developer Tools & DevOps",
    iconName: "Terminal",
    description: "Industry-standard tooling for collaborative engineering and rapid deployment.",
    skills: [
      { name: "Git & GitHub", level: "Advanced", featured: true, description: "Version control, branching, PR reviews, CI/CD" },
      { name: "VS Code", level: "Advanced", featured: true, description: "Extensions, debugging, snippet optimization" },
      { name: "Postman", level: "Advanced", featured: true, description: "API testing, automated suites, documentation" },
      { name: "Figma", level: "Intermediate", featured: false, description: "UI wireframing, component design systems" },
      { name: "Vercel", level: "Proficient", featured: true, description: "Edge deployments, preview branches, analytics" },
      { name: "Render", level: "Proficient", featured: false, description: "Backend web services, cron workers, databases" }
    ]
  },
  {
    title: "AI & Modern Workflows",
    iconName: "Bot",
    description: "Leveraging frontier foundation models and AI agent techniques in applications.",
    skills: [
      { name: "LLM APIs Integration", level: "Proficient", featured: true, description: "OpenAI, Google Gemini, OpenRouter integrations" },
      { name: "Prompt Engineering", level: "Advanced", featured: true, description: "System prompting, few-shot, structured JSON outputs" },
      { name: "AI-Assisted Development", level: "Expert", featured: true, description: "Agentic coding, automated refactoring, test generation" },
      { name: "Agentic Workflows", level: "Intermediate", featured: true, description: "Tool calling, autonomous multi-step reasoning" },
      { name: "OpenRouter", level: "Proficient", featured: false, description: "Model routing, fallback strategies, latency optimization" }
    ]
  }
];
