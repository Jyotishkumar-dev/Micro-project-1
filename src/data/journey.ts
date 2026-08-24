import { JourneyMilestone } from "@/types";

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "programming-foundations",
    year: "2023",
    phase: "01 / Foundations",
    title: "Starting with Core Programming",
    description:
      "Began my computer science journey by learning core programming concepts in C++ and Java, focusing on object-oriented programming, data structures, and algorithmic logic.",
    takeaways: [
      "Mastered OOP principles (Encapsulation, Inheritance, Polymorphism).",
      "Built initial console applications and practiced fundamental problem solving."
    ],
    category: "foundation"
  },
  {
    id: "web-development",
    year: "2024",
    phase: "02 / Modern Web",
    title: "Diving into Web Development & React",
    description:
      "Transitioned from console programs to visual web development. Mastered modern JavaScript (ES6+), semantic HTML, responsive CSS, and started building dynamic single-page applications with React and Tailwind CSS.",
    takeaways: [
      "Learned component-driven architecture and state management in React.",
      "Understood asynchronous JavaScript, API integration, and responsive design."
    ],
    category: "building"
  },
  {
    id: "full-stack-shipping",
    year: "2024 - 2025",
    phase: "03 / Full-Stack",
    title: "Building SmartAttend (Attendance System)",
    description:
      "Identified real administrative friction in college classrooms and built SmartAttend AI — a role-based attendance management platform with JWT authentication and PostgreSQL backend.",
    takeaways: [
      "Connected React client with Node.js/Express REST APIs.",
      "Implemented role-based access control and deployed the live product on Vercel."
    ],
    category: "building"
  },
  {
    id: "campus-leadership",
    year: "2024 - 2026",
    phase: "04 / Leadership",
    title: "Campus Leadership & Tech Club Involvement",
    description:
      "Served as Technical Coordinator and Room Coordinator in college tech events, member of the Graphics Core Team for the UDBHAV'26 Hackathon, and College Ambassador for Techfest IIT Bombay.",
    takeaways: [
      "Coordinated hackathons, technical workshops, and coding challenges for peers.",
      "Gained hands-on experience in team collaboration and event execution."
    ],
    category: "leadership"
  },
  {
    id: "squidhack-2026",
    year: "2026",
    phase: "05 / Hackathons",
    title: "SQUidHACK 2026 & KrishiFleet AI",
    description:
      "Collaborated with team 'The Last Commit' during the SQUidHACK 2026 hackathon. Designed and built KrishiFleet AI (farm equipment marketplace) and HackathonOS under 36-hour sprint conditions.",
    takeaways: [
      "Rapidly turned a problem statement into a working full-stack MVP.",
      "Presented live working software to judges and technical evaluators."
    ],
    category: "hackathon"
  },
  {
    id: "building-in-public",
    year: "2025 - Present",
    phase: "06 / Sharing",
    title: "Building in Public & Build With Jyotish",
    description:
      "Started sharing my learning journey publicly on YouTube (@buildwithjyotish07) and GitHub, documenting tech challenges, coding practice, and project breakdowns.",
    takeaways: [
      "Sharpened technical clarity by explaining code concepts to others.",
      "Maintained an open-source development footprint."
    ],
    category: "exploration"
  },
  {
    id: "ai-workflows",
    year: "Present",
    phase: "07 / Exploration",
    title: "Exploring AI Integrations & Modern Engineering",
    description:
      "Currently experimenting with foundation model APIs (Gemini, OpenAI, OpenRouter), prompt engineering, and agentic workflows to build smarter, product-focused web experiences.",
    takeaways: [
      "Integrating structured LLM outputs and tool calling into full-stack web applications.",
      "Continuously learning advanced DSA, system design, and clean code practices."
    ],
    category: "exploration"
  }
];
