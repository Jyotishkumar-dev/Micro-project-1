import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "krishifleet-ai",
    title: "KrishiFleet AI",
    category: "ai",
    tagline: "Intelligent Farm Equipment Marketplace & CHC Operations Platform",
    shortDescription:
      "An intelligent platform connecting smallholder farmers with Custom Hiring Centres (CHCs) to optimize machinery utilization, dynamic booking, smart recommendations, and predictive maintenance.",
    problem:
      "Smallholder farmers struggle with prohibitive farm machinery costs, lack of equipment availability transparency, and seasonal peak demand shortages, while Custom Hiring Centres suffer from idle fleet capacity and reactive maintenance.",
    solution:
      "Architected a dual-sided marketplace with an intelligent recommendation engine, real-time fleet availability calendars, dynamic pricing concepts based on seasonal demand, and maintenance analytics for fleet owners.",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "AI Integration", "PostgreSQL", "Tailwind CSS"],
    featured: true,
    status: "Hackathon Build",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://github.com/Jyotishkumar-dev",
    caseStudy: {
      overview:
        "KrishiFleet AI is a comprehensive agritech operations and marketplace ecosystem designed to democratize high-end agricultural equipment access for farmers while empowering Custom Hiring Centres (CHCs) with enterprise-grade fleet telemetry and demand optimization.",
      problem:
        "Over 85% of small and marginal farmers cannot afford tractors, harvesters, or specialized precision equipment. Meanwhile, regional CHCs struggle with manual paper logs, unpredictable seasonal peaks, underutilized assets during off-seasons, and sudden machine breakdowns.",
      solution:
        "Developed a unified web platform that enables farmers to discover, compare, and book verified equipment nearby with AI-assisted crop-cycle recommendations, while providing CHC fleet operators with an operations dashboard for tracking bookings, dispatch schedules, predictive service alerts, and dynamic revenue analytics.",
      keyFeatures: [
        {
          title: "Farmer Discovery & Smart Recommendations",
          description: "Location-aware equipment discovery filtered by farm size, soil type, crop stage, and budget constraints."
        },
        {
          title: "CHC Operator Command Center",
          description: "Centralized fleet management dashboard showing real-time machine availability, utilization metrics, and driver assignments."
        },
        {
          title: "Dynamic Demand & Pricing Insights",
          description: "AI-assisted demand estimation that suggests optimal pricing and dispatch schedules during peak harvest cycles."
        },
        {
          title: "Maintenance & Telemetry Alerts",
          description: "Predictive maintenance scheduling tracking operating hours to prevent costly mid-season machinery failures."
        },
        {
          title: "Multi-Role Booking Engine",
          description: "End-to-end booking lifecycle with instant status notifications, time-slot reservations, and payment receipts."
        }
      ],
      techStack: [
        {
          category: "Frontend",
          skills: ["Next.js 14 (App Router)", "React 18", "Tailwind CSS", "Framer Motion", "Lucide Icons"]
        },
        {
          category: "Backend & Services",
          skills: ["Node.js", "Express.js", "RESTful APIs", "JWT Authentication"]
        },
        {
          category: "Database & AI",
          skills: ["PostgreSQL", "Prisma ORM", "LLM APIs (OpenRouter / Gemini)", "Prompt Engineering"]
        }
      ],
      developmentProcess: [
        {
          step: 1,
          phase: "Research & Domain Discovery",
          description: "Interviewed agricultural workflows, CHC operational models, and identified key bottlenecks in seasonal farm equipment rentals."
        },
        {
          step: 2,
          phase: "System Architecture & Schema Design",
          description: "Structured multi-role database schemas for Farmers, CHC Operators, Equipment, Bookings, and Service Logs."
        },
        {
          step: 3,
          phase: "UI/UX & Prototyping",
          description: "Designed intuitive, high-contrast, accessible interfaces suitable for diverse user technical comfort levels."
        },
        {
          step: 4,
          phase: "Full-Stack Development",
          description: "Built the Next.js frontend integrated with server API routes and responsive dashboard analytics widgets."
        },
        {
          step: 5,
          phase: "AI Recommendation Integration",
          description: "Implemented contextual AI prompts that evaluate season, crop type, and soil requirements to propose ideal implements."
        },
        {
          step: 6,
          phase: "Deployment & Optimization",
          description: "Deployed to Vercel with optimized edge caching, lazy-loaded components, and comprehensive responsive testing."
        }
      ],
      challenges: [
        {
          challenge: "Modeling complex time-slot booking conflicts across disparate machinery fleets.",
          resolution: "Implemented deterministic SQL transaction locks and real-time availability calendar queries to prevent overlapping reservations."
        },
        {
          challenge: "Ensuring low latency on AI-assisted equipment recommendations.",
          resolution: "Cached recurring regional crop-recommendation templates while streaming dynamic tailored parameters asynchronously."
        }
      ],
      learnings: [
        "Architecting multi-tenant user permissions with distinct dashboard views.",
        "Balancing real-time state updates with clean server component data fetching.",
        "Translating complex domain constraints into intuitive, human-centered UI workflows."
      ]
    }
  },
  {
    id: "smartattend-ai",
    title: "SmartAttend AI (Attendance Management System)",
    category: "fullstack",
    tagline: "Multi-Role Academic Attendance & Analytics SaaS Platform",
    shortDescription:
      "A modern, role-based attendance management ecosystem built for colleges and universities to replace manual paper sheets with digital workflows, analytics, and security.",
    problem:
      "Educational institutions lose hundreds of hours to manual paper registers, prone to proxy attendance, human recording errors, and lack of actionable real-time student attendance trends for faculty and HODs.",
    solution:
      "Engineered an enterprise-grade multi-role SaaS (Student, Faculty, HOD, Admin) with secure JWT access/refresh token authentication, visual attendance calendar heatmaps, and automated eligibility warnings.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Prisma"],
    featured: true,
    status: "Live",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://attendance-management-system-projec-steel.vercel.app/login",
    caseStudy: {
      overview:
        "SmartAttend AI is a production-grade academic management system designed to streamline attendance logging, track aggregate performance, and eliminate administrative friction across universities.",
      problem:
        "Manual attendance systems suffer from high administrative overhead, proxy attendance, delayed reporting to parents/HODs, and zero real-time visibility into students at risk of attendance shortages.",
      solution:
        "Engineered a scalable multi-tier web application with role-based access control (RBAC), intuitive single-click session logging for instructors, visual student attendance timelines, and automated shortage threshold alerts.",
      keyFeatures: [
        {
          title: "Five Distinct RBAC Roles",
          description: "Specialized permissions and tailored portals for Super Admin, College Admin, HOD, Faculty, and Students."
        },
        {
          title: "Interactive Visual Calendar & Heatmaps",
          description: "Visual date-picker and monthly calendar view indicating present, absent, excused, and holiday states."
        },
        {
          title: "Real-Time Shortage Risk Alerts",
          description: "Automatic visual flags for students dropping below mandatory 75% attendance criteria."
        },
        {
          title: "Batch Class Attendance Marking",
          description: "Rapid one-click batch marking with keyboard shortcuts and multi-select for fast classroom logging."
        },
        {
          title: "Comprehensive Export & Reports",
          description: "Exportable CSV and PDF summary reports for semester reviews and accreditation audits."
        }
      ],
      techStack: [
        {
          category: "Frontend",
          skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "Lucide Icons"]
        },
        {
          category: "Backend",
          skills: ["Node.js", "Express.js", "REST APIs", "JWT (Access & Refresh Tokens)", "Bcrypt"]
        },
        {
          category: "Database & Deployment",
          skills: ["PostgreSQL", "Prisma ORM", "Vercel", "Render"]
        }
      ],
      developmentProcess: [
        {
          step: 1,
          phase: "Stakeholder Requirement Analysis",
          description: "Mapped out attendance workflows across faculty, department chairs, and student requirements."
        },
        {
          step: 2,
          phase: "Role-Based Access Control Architecture",
          description: "Designed secure JWT authentication system with httpOnly cookies and fine-grained route middlewares."
        },
        {
          step: 3,
          phase: "Database Normalization & Constraints",
          description: "Constructed relational models for courses, batches, enrollments, sessions, and daily attendance logs."
        },
        {
          step: 4,
          phase: "Frontend Dashboard Construction",
          description: "Built responsive, accessible dashboards with custom data tables, filtering, and summary statistics."
        },
        {
          step: 5,
          phase: "Integration & Edge Testing",
          description: "Stress-tested concurrent classroom logging and edge cases like leave approvals and retroactive edits."
        },
        {
          step: 6,
          phase: "Production Deployment",
          description: "Deployed frontend on Vercel and backend services with continuous integration."
        }
      ],
      challenges: [
        {
          challenge: "Managing complex session state across hundreds of students without UI performance degradation.",
          resolution: "Optimized React state using localized batch dispatching and virtualized list rendering."
        },
        {
          challenge: "Preventing unauthorized attendance tampering across distributed client endpoints.",
          resolution: "Implemented server-side validation verifying instructor authorization against course schedule timestamps."
        }
      ],
      learnings: [
        "Deep understanding of secure session management and token lifecycle.",
        "Relational database query optimization for historical time-series logs.",
        "Designing enterprise UX where speed of daily data entry is the primary metric."
      ]
    }
  },
  {
    id: "hackathon-os",
    title: "HackathonOS",
    category: "hackathon",
    tagline: "End-to-End Hackathon Orchestration & Live Operations System",
    shortDescription:
      "An all-in-one operating platform built during SQUIDHACK 2026 to manage participant registration, QR check-ins, mentor queues, live judge scoring, and dynamic leaderboards.",
    problem:
      "Organizing large-scale hackathons requires juggling disconnected Google Forms, spreadsheets, Discord channels, and paper judging sheets, leading to chaotic schedules and judging delays.",
    solution:
      "Created a unified command center featuring instant QR check-in scanning, team matchmaking, mentor queue management, judge rubrics with live scoring aggregation, and digital certificate issuing.",
    tags: ["React", "Node.js", "Express", "Tailwind CSS", "Real-Time WebSockets", "QR Scanner API"],
    featured: true,
    status: "Hackathon Build",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://github.com/Jyotishkumar-dev",
    caseStudy: {
      overview:
        "HackathonOS was built under high-tempo hackathon pressure by Team 'The Last Commit' at SQUIDHACK 2026 to replace fragmented event coordination tools with a synchronized real-time web platform.",
      problem:
        "Hackathon organizers lose critical momentum managing hundreds of attendees manually at the door, tracking mentor capacity, calculating judge scores across disparate rubrics, and publishing final rankings.",
      solution:
        "Built an integrated web OS that provides organizer controls, participant dashboard with schedule countdowns, digital badge QR scanner, mentor request ticketing, and a live aggregate judge scoring board.",
      keyFeatures: [
        {
          title: "Instant QR Entry Scanner",
          description: "Rapid participant check-in scanning via web camera with instant verification against database."
        },
        {
          title: "Mentor Queue & Helpdesk",
          description: "Ticket-based mentor request system allowing teams to get assistance based on tech stack tag matching."
        },
        {
          title: "Multi-Criteria Judge Portal",
          description: "Dedicated judge evaluation screen with weighted sliders for innovation, technical execution, UI/UX, and pitch."
        },
        {
          title: "Live Leaderboard & Showcase",
          description: "Real-time results calculation with tie-breaker logic and public project showcase gallery."
        }
      ],
      techStack: [
        {
          category: "Frontend",
          skills: ["React 18", "Tailwind CSS", "Lucide Icons", "HTML5 QR Scanner"]
        },
        {
          category: "Backend & Real-Time",
          skills: ["Node.js", "Express", "REST APIs", "WebSockets"]
        },
        {
          category: "Database & Tools",
          skills: ["MongoDB", "Mongoose", "Git & GitHub", "Vercel"]
        }
      ],
      developmentProcess: [
        {
          step: 1,
          phase: "Problem Framing & Sprint Planning",
          description: "Deconstructed hackathon operational pain points within the first 2 hours of the hackathon."
        },
        {
          step: 2,
          phase: "Schema & Endpoint Contract Drafting",
          description: "Drafted team, user, ticket, and score data contracts to allow parallel frontend and backend development."
        },
        {
          step: 3,
          phase: "Core Engine Implementation",
          description: "Built QR authentication, scoring arithmetic formulas, and role-gated navigation."
        },
        {
          step: 4,
          phase: "UI Polish & Dark Theme Design",
          description: "Implemented high-energy developer aesthetic with status badges and animated counters."
        },
        {
          step: 5,
          phase: "Team Demo & Pitch Integration",
          description: "Conducted end-to-end simulated hackathon run-through for judges and demo evaluation."
        }
      ],
      challenges: [
        {
          challenge: "Completing full-stack multi-role workflows within a strict 36-hour hackathon timeframe.",
          resolution: "Prioritized strict MVP feature slicing and clean modular API contracts between team members."
        },
        {
          challenge: "Preventing score tampering and ensuring fair aggregate calculation.",
          resolution: "Built normalized weighted average calculation on the server with audit trails."
        }
      ],
      learnings: [
        "Rapid team collaboration and Git branching hygiene under extreme time limits.",
        "Designing resilient UX states for high-frequency live event situations.",
        "Communicating product value effectively during technical hackathon demos."
      ]
    }
  },
  {
    id: "ai-career-intelligence",
    title: "AI Career Intelligence Platform",
    category: "ai",
    tagline: "Autonomous Market-Intelligence & Skill Alignment Agents",
    shortDescription:
      "An intelligent career analysis platform using LLM agents to parse real-time job market requirements, benchmark candidate skill gaps, and generate customized roadmaps.",
    problem:
      "Early-career software developers waste hundreds of hours navigating scattered job postings without understanding what specific modern skill gaps are blocking them from top engineering roles.",
    solution:
      "Created an agentic career engine that analyzes job specifications, benchmarks developer portfolios and GitHub activity, and generates actionable 30/60/90-day learning trajectories.",
    tags: ["React 19", "NestJS", "TypeScript", "Prisma", "OpenAI API", "Tailwind CSS", "shadcn/ui"],
    featured: true,
    status: "In Development",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://github.com/Jyotishkumar-dev",
    caseStudy: {
      overview:
        "AI Career Intelligence Platform is a next-generation developer tooling platform designed to give software engineers data-backed clarity on market demand, technical skill alignment, and targeted learning paths.",
      problem:
        "Tech job descriptions are filled with buzzwords and shifting requirements. Aspiring engineers struggle to prioritize what technologies actually matter for specific career tracks.",
      solution:
        "Developed an autonomous pipeline that scrapes, normalizes, and analyzes market skill graphs, comparing them against the user's project portfolio to produce tailored development roadmaps.",
      keyFeatures: [
        {
          title: "Skill Gap Benchmarking Engine",
          description: "Automated analysis comparing user tech stack against industry requirements for FDE, Full-Stack, and AI roles."
        },
        {
          title: "Dynamic Learning Trajectory Generator",
          description: "Personalized milestone generator breaking down complex technologies into weekly project-based challenges."
        },
        {
          title: "Resume & Portfolio Feedback Agent",
          description: "LLM-powered structural critique focusing on impact metrics, architecture explanations, and clarity."
        },
        {
          title: "Market Demand Radar",
          description: "Visual charts tracking rising and declining framework adoption across startup and enterprise roles."
        }
      ],
      techStack: [
        {
          category: "Frontend",
          skills: ["React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"]
        },
        {
          category: "Backend & Systems",
          skills: ["NestJS", "TypeScript", "Prisma ORM", "Argon2id Auth", "Docker"]
        },
        {
          category: "AI & Data",
          skills: ["OpenAI / OpenRouter APIs", "Structured Outputs", "Prompt Optimization"]
        }
      ],
      developmentProcess: [
        {
          step: 1,
          phase: "Architecture Definition & Monorepo Setup",
          description: "Structured clean NestJS backend alongside modern React 19 client with strict shared TypeScript types."
        },
        {
          step: 2,
          phase: "Prompt Pipeline Engineering",
          description: "Engineered robust JSON-schema-constrained LLM prompts for reliable data extraction without hallucinations."
        },
        {
          step: 3,
          phase: "Authentication & User Vault",
          description: "Implemented Argon2id password hashing and session tokens for secure user progress persistence."
        },
        {
          step: 4,
          phase: "Roadmap Generation Engine",
          description: "Created deterministic milestone sequencing based on prerequisite tech dependencies."
        }
      ],
      challenges: [
        {
          challenge: "Guaranteeing structured and deterministic responses from LLM reasoning calls.",
          resolution: "Enforced strict Zod schema validation on JSON mode outputs with automatic retry fallbacks."
        }
      ],
      learnings: [
        "Advanced prompt engineering techniques for structured data generation.",
        "NestJS dependency injection and enterprise backend patterns.",
        "Building user interfaces that make AI insights immediately actionable."
      ]
    }
  }
];
