import { LearningMilestone } from "@/types";

export const learningRoadmapData: LearningMilestone[] = [
  {
    title: "Java & Advanced Data Structures",
    status: "in-progress",
    category: "Core Computer Science",
    description: "Deepening problem solving on Trees, Graphs, Dynamic Programming, and System Optimization in Java.",
    topics: ["Graph Traversals & Dijkstra", "Binary Search Trees & AVL", "Dynamic Programming Memoization", "Concurrency & Collections Framework"]
  },
  {
    title: "Full Stack Next.js 14 & Server Actions",
    status: "mastered",
    category: "Modern Web Engineering",
    description: "Production web development with App Router, Edge Middleware, streaming UI, and type-safe server actions.",
    topics: ["Next.js 14 App Router", "Server vs. Client Components", "Optimistic Updates", "Tailwind CSS Component Architecture"]
  },
  {
    title: "Relational Databases & Performance Tuning",
    status: "in-progress",
    category: "Database Systems",
    description: "Mastering complex SQL queries, indexing strategies, normalization, and ACID transactions with PostgreSQL & Prisma.",
    topics: ["B-Tree Indexing & Query Execution Plans", "Connection Pooling & pgBouncer", "Prisma & Drizzle Migrations", "Multi-tenant Schema Isolation"]
  },
  {
    title: "AI Integration & Autonomous Agent Workflows",
    status: "in-progress",
    category: "AI & Modern Engineering",
    description: "Building production applications with LLM function calling, semantic search embeddings, and multi-agent coordination.",
    topics: ["Function & Tool Calling", "OpenRouter / Gemini / OpenAI APIs", "Structured JSON Extraction & Zod Validation", "Vector Search & Retrieval"]
  },
  {
    title: "Distributed Systems & Cloud Infrastructure",
    status: "planned",
    category: "System Design",
    description: "Studying horizontal scaling, caching with Redis, message brokers (Kafka/RabbitMQ), and microservice communication.",
    topics: ["Redis Caching Patterns", "Load Balancing & Reverse Proxies", "Event-Driven Message Queues", "Containerization with Docker"]
  },
  {
    title: "Forward Deployed Engineering (FDE) Practices",
    status: "planned",
    category: "Product & Engineering",
    description: "Bridging customer requirements with rapid technical implementation, telemetry, and business metrics.",
    topics: ["Rapid Prototyping & Feedback Loops", "Telemetry & Observability", "Client Integration Engineering", "High-Impact Product Scoping"]
  }
];
