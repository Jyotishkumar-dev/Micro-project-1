import { Skill } from "@/types";

export const skillsData: Skill[] = [
  { id: "java", name: "Java", category: "language", proficiency: "proficient", context: "OOP, Core Syntax, DSA", highlight: true },
  { id: "javascript", name: "JavaScript", category: "language", proficiency: "proficient", context: "ES6+, Async/Await, DOM", highlight: true },
  { id: "typescript", name: "TypeScript", category: "language", proficiency: "proficient", context: "Type Safety, Interfaces, Generics", highlight: true },
  { id: "python", name: "Python", category: "language", proficiency: "proficient", context: "Data Science, Scripting", highlight: false },
  { id: "c", name: "C", category: "language", proficiency: "learning", context: "Systems Programming", highlight: false },
  { id: "cpp", name: "C++", category: "language", proficiency: "proficient", context: "OOP, STL, Competitive Programming", highlight: true },

  { id: "react", name: "React.js", category: "frontend", proficiency: "proficient", context: "Hooks, State Management, Component Architecture", highlight: true },
  { id: "nextjs", name: "Next.js", category: "frontend", proficiency: "proficient", context: "App Router, Server Components, API Routes", highlight: true },
  { id: "html", name: "HTML5", category: "frontend", proficiency: "advanced", context: "Semantic Markup, Accessibility", highlight: false },
  { id: "css", name: "CSS3", category: "frontend", proficiency: "advanced", context: "Flexbox, Grid, Animations", highlight: false },
  { id: "tailwind", name: "Tailwind CSS", category: "frontend", proficiency: "advanced", context: "Responsive Layouts, Custom Themes", highlight: true },

  { id: "nodejs", name: "Node.js", category: "backend", proficiency: "proficient", context: "Event-driven Runtime, REST APIs", highlight: true },
  { id: "express", name: "Express.js", category: "backend", proficiency: "proficient", context: "Routing, Middleware, API Design", highlight: true },
  { id: "rest", name: "REST APIs", category: "backend", proficiency: "proficient", context: "API Design, Authentication", highlight: false },
  { id: "jwt", name: "JWT Auth", category: "backend", proficiency: "proficient", context: "Authentication, Refresh Tokens, RBAC", highlight: true },

  { id: "postgresql", name: "PostgreSQL", category: "database", proficiency: "proficient", context: "Relational Modeling, Queries, Joins", highlight: true },
  { id: "mongodb", name: "MongoDB", category: "database", proficiency: "learning", context: "Document Modeling, Aggregations", highlight: false },
  { id: "sql", name: "SQL", category: "database", proficiency: "proficient", context: "Query Optimization, Indexing", highlight: false },
  { id: "drizzle", name: "Drizzle ORM", category: "database", proficiency: "learning", context: "Type-safe Database Access", highlight: false },

  { id: "git", name: "Git & GitHub", category: "tool", proficiency: "advanced", context: "Version Control, Branching, PRs", highlight: true },
  { id: "vscode", name: "VS Code", category: "tool", proficiency: "advanced", context: "Primary IDE, Extensions", highlight: true },
  { id: "postman", name: "Postman", category: "tool", proficiency: "proficient", context: "API Testing & Verification", highlight: false },
  { id: "figma", name: "Figma", category: "tool", proficiency: "learning", context: "UI Wireframing, Prototyping", highlight: false },
  { id: "vercel", name: "Vercel", category: "tool", proficiency: "proficient", context: "Frontend Deployments", highlight: true },

  { id: "oop", name: "OOP", category: "core", proficiency: "advanced", context: "Encapsulation, Inheritance, Polymorphism", highlight: true },
  { id: "dsa", name: "Data Structures & Algorithms", category: "core", proficiency: "proficient", context: "Trees, Graphs, Recursion, Optimization", highlight: true },
  { id: "dbms", name: "DBMS", category: "core", proficiency: "proficient", context: "Normalization, Transactions, ACID", highlight: false },
  { id: "auth", name: "Authentication & RBAC", category: "core", proficiency: "proficient", context: "JWT, Role-Based Access Control", highlight: true },
  { id: "system-design", name: "System Design Basics", category: "core", proficiency: "learning", context: "Caching, Load Balancing Fundamentals", highlight: false },
];

export const skillCategories = [
  { key: "language", label: "Languages", icon: "code" },
  { key: "frontend", label: "Frontend", icon: "layout" },
  { key: "backend", label: "Backend", icon: "server" },
  { key: "database", label: "Databases", icon: "database" },
  { key: "tool", label: "Tools", icon: "wrench" },
  { key: "core", label: "Core Concepts", icon: "brain" },
] as const;