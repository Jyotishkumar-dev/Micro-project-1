import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "krishifleet-ai",
    number: "01",
    title: "KrishiFleet AI",
    category: "Agritech / Hackathon Build",
    tagline: "Intelligent Farm Machinery Discovery & CHC Operations Platform",
    shortDescription:
      "A platform built during SQUidHACK 2026 to help smallholder farmers discover and rent agricultural equipment while providing Custom Hiring Centres (CHCs) with equipment operations management.",
    problem:
      "Most smallholder farmers cannot afford expensive tractors or specialized harvesting equipment. Meanwhile, regional Custom Hiring Centres face difficulty managing rental schedules and equipment availability efficiently.",
    solution:
      "Designed a dual-sided web platform where farmers can search for verified machinery nearby based on crop type and budget, while CHC hub operators can track active bookings and equipment status.",
    myContribution:
      "Co-designed the full-stack architecture, built the Next.js and Tailwind frontend interfaces, structured the database schemas, and integrated equipment discovery workflows.",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "REST API", "Database Design"],
    featured: true,
    status: "Hackathon Build",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://github.com/Jyotishkumar-dev",
    caseStudy: {
      problem:
        "Agricultural machinery costs are prohibitive for individual smallholder farmers. When seasonal harvesting starts, farmers struggle to locate available equipment, while Custom Hiring Centres (CHCs) lack a centralized digital tool to manage bookings and dispatch machinery.",
      idea:
        "Build a practical web application connecting farmers with nearby machinery rental hubs, featuring intuitive search by equipment category, availability calendars, and a simplified management interface for CHC operators.",
      whatIBuilt:
        "Developed the responsive web application using Next.js 14 and Tailwind CSS. Implemented farmer discovery screens, equipment detail cards, and an operator management view for reviewing incoming equipment rental requests.",
      keyFeatures: [
        {
          title: "Equipment Discovery & Filtering",
          description: "Search implements by category (Tractors, Harvesters, Tillers), location radius, and daily rental rates."
        },
        {
          title: "CHC Operator Portal",
          description: "Dashboard for fleet owners to view machinery availability, booking requests, and equipment status."
        },
        {
          title: "Booking Request Flow",
          description: "Step-by-step reservation form allowing farmers to select time slots and specify farm location details."
        },
        {
          title: "Responsive Mobile-First UI",
          description: "Clean layout designed to work smoothly on mobile browsers for field usability."
        }
      ],
      techStack: [
        "Next.js 14",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "RESTful API"
      ],
      challenges: [
        {
          challenge: "Designing an intuitive UI suitable for users with varying levels of technical familiarity.",
          resolution: "Focused on high contrast, clear visual icons, large tap targets, and streamlined form inputs."
        },
        {
          challenge: "Structuring the equipment availability logic within a fast-paced 36-hour hackathon timeframe.",
          resolution: "Prioritized clean modular data models and created clear API contracts to coordinate frontend and backend development."
        }
      ],
      learnings: [
        "How to quickly translate a real-world domain problem into an actionable MVP.",
        "Rapid prototyping and component architecture under hackathon time limits.",
        "Collaborative Git workflows and sprint communication within a team."
      ]
    }
  },
  {
    id: "smartattend-ai",
    number: "02",
    title: "SmartAttend (Attendance Management System)",
    category: "Full Stack SaaS",
    tagline: "Modern Role-Based College Attendance & Record System",
    shortDescription:
      "A complete web-based academic attendance platform built to replace traditional paper registers with a streamlined digital logging workflow and visual attendance records.",
    problem:
      "Universities and colleges spend valuable lecture time manually calling roll sheets, which often leads to recording errors, lost paperwork, and lack of clear attendance visibility for students and faculty.",
    solution:
      "Engineered a digital attendance platform featuring role-based portals for Students, Faculty, and Administrators, intuitive class session marking, and visual attendance summaries.",
    myContribution:
      "Built the end-to-end web application: authentication system, database schema modeling, backend REST APIs, and the responsive React frontend dashboard.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "JWT Auth", "PostgreSQL"],
    featured: true,
    status: "Live",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://attendance-management-system-projec-steel.vercel.app/login",
    caseStudy: {
      problem:
        "Paper-based attendance sheets in colleges are inefficient, slow to record in large classrooms, and prone to proxy attendance. Students have little visibility into their cumulative percentages until semester end.",
      idea:
        "Create a dedicated, secure web platform where faculty can mark attendance with minimal clicks during class, and students can view their real-time attendance percentage and calendar records.",
      whatIBuilt:
        "Constructed a multi-role web platform using React and TypeScript on the frontend with a Node.js/Express backend. Implemented JWT token-based authentication, student roll lists, and visual percentage indicators.",
      keyFeatures: [
        {
          title: "Role-Based Portals",
          description: "Distinct dashboards for Faculty (session marking, student lists) and Students (attendance percentages, subject breakdowns)."
        },
        {
          title: "Quick Classroom Session Logging",
          description: "Streamlined batch attendance marking interface allowing instructors to quickly toggle present/absent states."
        },
        {
          title: "Visual Attendance Percentage",
          description: "Clear indicator bars and subject-wise metrics showing students whether they meet the required attendance thresholds."
        },
        {
          title: "Secure Authentication",
          description: "Protected route middlewares and JWT token handling for verified role access."
        }
      ],
      techStack: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "JWT Authentication",
        "PostgreSQL / Prisma"
      ],
      challenges: [
        {
          challenge: "Ensuring attendance marking remains fast and responsive during live class sessions.",
          resolution: "Optimized React state updates with batch submission so teachers can log an entire classroom in one click."
        },
        {
          challenge: "Designing proper role-based route protection across student and teacher views.",
          resolution: "Implemented server-side token verification with custom role check middlewares on all API routes."
        }
      ],
      learnings: [
        "Designing relational database schemas for academic batches, courses, and attendance logs.",
        "Handling user authentication, token storage, and protected navigation in React.",
        "Deploying and connecting decoupled frontend and backend services to production on Vercel."
      ]
    }
  },
  {
    id: "hackathon-os",
    number: "03",
    title: "HackathonOS",
    category: "Event Operations Platform",
    tagline: "End-to-End Hackathon Coordination & Operations Tool",
    shortDescription:
      "A platform developed by team 'The Last Commit' at SQUidHACK 2026 to simplify participant check-ins, mentor queues, and judging rubrics for hackathons.",
    problem:
      "Organizing student hackathons often involves juggling messy spreadsheets, scattered Google forms, and chaotic judging sessions.",
    solution:
      "Built a unified event tool featuring participant verification, team registration tracking, mentor help requests, and a centralized judging evaluation interface.",
    myContribution:
      "Implemented responsive frontend views, coordinate event dashboard state, and connected rubric calculation components with the backend API.",
    tags: ["React", "Node.js", "Express", "Tailwind CSS", "REST APIs", "Team Project"],
    featured: true,
    status: "Hackathon Build",
    githubUrl: "https://github.com/Jyotishkumar-dev",
    liveUrl: "https://github.com/Jyotishkumar-dev",
    caseStudy: {
      problem:
        "Running hackathons requires tracking hundreds of attendees, team matching, mentor availability, and score calculations under tight time pressure.",
      idea:
        "Create a streamlined web interface where organizers can view checked-in teams, mentors can manage incoming assistance tickets, and judges can enter scored rubrics.",
      whatIBuilt:
        "Built the client-side dashboard in React, created judge evaluation scorecards with weighted criteria, and implemented organizer management tables.",
      keyFeatures: [
        {
          title: "Organizer Command Center",
          description: "Live overview of registered teams, check-in status, and event schedule milestones."
        },
        {
          title: "Judge Evaluation Rubric",
          description: "Interactive scoring sliders covering innovation, technical execution, design, and presentation."
        },
        {
          title: "Mentor Help Desk",
          description: "Ticket submission interface where hacking teams can request mentor guidance for specific tech stacks."
        }
      ],
      techStack: [
        "React",
        "Tailwind CSS",
        "Node.js",
        "Express",
        "Git & GitHub"
      ],
      challenges: [
        {
          challenge: "Coordinating multi-developer feature branches within a 36-hour hackathon crunch.",
          resolution: "Maintained clear component boundaries and agreed on shared data contracts before writing code."
        }
      ],
      learnings: [
        "Effective git branching hygiene and collaborative problem-solving under deadline pressure.",
        "Structuring scalable component interfaces for fast iteration."
      ]
    }
  }
];
