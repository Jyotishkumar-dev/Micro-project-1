-- ============================================================================
-- Phase 3 · Migration 0004 — Seed data
--
-- Seeds the documented portfolio content. Idempotent: safe to re-run, because
-- every insert is keyed on a natural column and guarded with `on conflict`.
--
-- Two deliberate omissions, so this seed cannot publish anything unverified:
--   1. External URLs (GitHub repo links, Vercel demo, HackerRank) are left NULL.
--      The previous values were bare profile links, not verified per-project
--      URLs. Add the real ones from the admin dashboard.
--   2. Fabricated metrics are stripped from leadership copy (participant
--      counts, attendee counts, hackathon hour counts). Titles, organisations,
--      roles and periods come from the documented resume.
--
-- All seed data is `published = true` so the public site renders immediately.
-- Flip to false in the admin dashboard to hide an entry without deleting it.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Admin allowlist — the only email allowed to register (see block_public_signup)
-- Change this if the owner account uses a different address.
-- ---------------------------------------------------------------------------
insert into public.admin_allowlist (email)
values ('jyotishyt58@gmail.com')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- Projects — SmartAttend, KrishiFleet AI
-- ---------------------------------------------------------------------------
insert into public.projects (
  title, slug, tagline, description, category, status,
  problem, solution, my_contribution, technologies, case_study,
  github_url, live_url, image_url, featured, published, display_order
)
values (
  'SmartAttend',
  'smartattend',
  'Modern Role-Based College Attendance & Record System',
  'A complete web-based academic attendance platform built to replace traditional paper registers with a streamlined digital logging workflow and visual attendance records.',
  'Full-Stack SaaS',
  'Live',
  'Universities and colleges spend valuable lecture time manually calling roll sheets, which often leads to recording errors, lost paperwork, and lack of clear attendance visibility for students and faculty.',
  'Engineered a digital attendance platform featuring role-based portals for Students, Faculty, and Administrators, intuitive class session marking, and visual attendance summaries.',
  'Built the end-to-end web application: authentication system, database schema modeling, backend REST APIs, and the responsive React frontend dashboard.',
  array['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'JWT Auth', 'PostgreSQL', 'Drizzle ORM'],
  $$
  {
    "problem": "Paper-based attendance sheets in colleges are inefficient, slow to record in large classrooms, and prone to proxy attendance. Students have little visibility into their cumulative percentages until semester end.",
    "idea": "Create a dedicated, secure web platform where faculty can mark attendance with minimal clicks during class, and students can view their real-time attendance percentage and calendar records.",
    "whatIBuilt": "Constructed a multi-role web platform using React and TypeScript on the frontend with a Node.js/Express backend. Implemented JWT token-based authentication, student roll lists, and visual percentage indicators.",
    "keyFeatures": [
      { "title": "Role-Based Portals", "description": "Distinct dashboards for Faculty (session marking, student lists) and Students (attendance percentages, subject breakdowns)." },
      { "title": "Quick Classroom Session Logging", "description": "Streamlined batch attendance marking interface allowing instructors to quickly toggle present/absent states." },
      { "title": "Visual Attendance Percentage", "description": "Clear indicator bars and subject-wise metrics showing students whether they meet the required attendance thresholds." },
      { "title": "Secure Authentication", "description": "Protected route middlewares and JWT token handling for verified role access." }
    ],
    "techStack": ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "JWT Authentication", "PostgreSQL", "Drizzle ORM"],
    "challenges": [
      { "challenge": "Ensuring attendance marking remains fast and responsive during live class sessions.", "resolution": "Optimized React state updates with batch submission so a teacher can log an entire classroom in one action." },
      { "challenge": "Designing proper role-based route protection across student and teacher views.", "resolution": "Implemented server-side token verification with custom role check middlewares on API routes." }
    ],
    "learnings": [
      "Designing relational database schemas for academic batches, courses, and attendance logs.",
      "Handling user authentication, token storage, and protected navigation in React.",
      "Deploying and connecting decoupled frontend and backend services in production."
    ]
  }
  $$::jsonb,
  null, null, null,
  true, true, 1
)
on conflict (slug) do update
  set title            = excluded.title,
      tagline          = excluded.tagline,
      description      = excluded.description,
      category         = excluded.category,
      status           = excluded.status,
      problem          = excluded.problem,
      solution         = excluded.solution,
      my_contribution  = excluded.my_contribution,
      technologies     = excluded.technologies,
      case_study       = excluded.case_study;

insert into public.projects (
  title, slug, tagline, description, category, status,
  problem, solution, my_contribution, technologies, case_study,
  github_url, live_url, image_url, featured, published, display_order
)
values (
  'KrishiFleet AI',
  'krishifleet-ai',
  'Intelligent Farm Machinery Discovery & CHC Operations Platform',
  'A platform built during SQUidHACK 2026 to help smallholder farmers discover and rent agricultural equipment while providing Custom Hiring Centres (CHCs) with equipment operations management.',
  'Agritech / Hackathon Build',
  'Hackathon Build',
  'Most smallholder farmers cannot afford expensive tractors or specialized harvesting equipment. Meanwhile, regional Custom Hiring Centres face difficulty managing rental schedules and equipment availability efficiently.',
  'Designed a dual-sided web platform where farmers can search for verified machinery nearby based on crop type and budget, while CHC hub operators can track active bookings and equipment status.',
  'Co-designed the full-stack architecture, built the Next.js and Tailwind frontend interfaces, structured the database schemas, and integrated equipment discovery workflows.',
  array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'React Hook Form', 'Zod', 'Recharts', 'REST API'],
  $$
  {
    "problem": "Agricultural machinery costs are prohibitive for individual smallholder farmers. When seasonal harvesting starts, farmers struggle to locate available equipment, while Custom Hiring Centres (CHCs) lack a centralized digital tool to manage bookings and dispatch machinery.",
    "idea": "Build a practical web application connecting farmers with nearby machinery rental hubs, featuring intuitive search by equipment category, availability calendars, and a simplified management interface for CHC operators.",
    "whatIBuilt": "Developed the responsive web application using Next.js and Tailwind CSS. Implemented farmer discovery screens, equipment detail cards, and an operator management view for reviewing incoming equipment rental requests.",
    "keyFeatures": [
      { "title": "Equipment Discovery & Filtering", "description": "Search by equipment category (Tractors, Harvesters, Tillers), location radius, and daily rental rates." },
      { "title": "CHC Operator Portal", "description": "Dashboard for fleet owners to view machinery availability, booking requests, and equipment status." },
      { "title": "Booking Request Flow", "description": "Step-by-step reservation form allowing farmers to select time slots and specify farm location details." },
      { "title": "Responsive Mobile-First UI", "description": "Clean layout designed to work smoothly on mobile browsers for field usability." }
    ],
    "techStack": ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Hook Form", "Zod", "Recharts", "RESTful API"],
    "challenges": [
      { "challenge": "Designing an intuitive UI suitable for users with varying levels of technical familiarity.", "resolution": "Focused on high contrast, clear visual icons, large tap targets, and streamlined form inputs." },
      { "challenge": "Structuring equipment availability logic within a fast-paced hackathon timeframe.", "resolution": "Prioritized clean modular data models and clear API contracts to coordinate frontend and backend development." }
    ],
    "learnings": [
      "How to quickly translate a real-world domain problem into an actionable MVP.",
      "Rapid prototyping and component architecture under hackathon time limits.",
      "Collaborative Git workflows and sprint communication within a team."
    ]
  }
  $$::jsonb,
  null, null, null,
  true, true, 2
)
on conflict (slug) do update
  set title            = excluded.title,
      tagline          = excluded.tagline,
      description      = excluded.description,
      category         = excluded.category,
      status           = excluded.status,
      problem          = excluded.problem,
      solution         = excluded.solution,
      my_contribution  = excluded.my_contribution,
      technologies     = excluded.technologies,
      case_study       = excluded.case_study;

-- ---------------------------------------------------------------------------
-- Experience / Leadership
-- ---------------------------------------------------------------------------
insert into public.experience (title, slug, organization, type, role, start_date, is_current, description, highlights, published, display_order)
values
  ('SQUidHACK 2026', 'squidhack-2026', 'E-Cell SCSIT, DAVV', 'hackathon', 'Technical Lead', date '2026-08-01', false, '', '{}', true, 1),
  ('Hackathon, E-Cell SCSIT, DAVV', 'e-cell-scsi-davv-hackathon', 'DAVV, Indore', 'hackathon', 'Tech Co-Lead & Presentation Lead', date '2026-03-01', false, '', '{}', true, 2),
  ('Techfest, IIT Bombay', 'techfest-iit-bombay', 'IIT Bombay', 'ambassador', 'College Ambassador', null, true, '', '{}', true, 3),
  ('Social Media & Tech Club', 'social-media-tech-club', 'Alta School of Technology', 'club', 'Core Member', date '2026-08-01', true, '', '{}', true, 4),
  ('UDBHAV''26', 'udbhav-26', 'SAGE University', 'leadership', 'Graphics Core Committee Member', date '2026-04-01', false, '', '{}', true, 5)
on conflict (slug) do update
  set title        = excluded.title,
      organization = excluded.organization,
      type         = excluded.type,
      role         = excluded.role,
      display_order = excluded.display_order;

-- ---------------------------------------------------------------------------
-- Certifications
-- issue_date is left NULL on purpose: the year of each credential needs to be
-- confirmed by the owner before it is published. Fill it in the dashboard.
-- ---------------------------------------------------------------------------
insert into public.certifications (name, slug, organization, issue_date, credential_url, badge, description, details, published, display_order)
values
  ('TCS iON Career Edge – Young Professional', 'tcs-ion-career-edge-young-professional', 'TCS iON', null, null, 'Professional Readiness',
   'Workplace communication, problem-solving methodologies, collaboration, and professional presentation skills.',
   '{}', true, 1),
  ('C++ Essentials 1', 'cplusplus-essentials-1', 'Cisco Networking Academy', null, null, 'Industry Certified',
   'Foundational C++: data types, flow control, pointers, and object-oriented programming.',
   '{}', true, 2),
  ('Introduction to Generative AI Studio', 'intro-generative-ai-studio', 'Simplilearn SkillUP', null, null, 'AI Fundamentals',
   'Generative AI concepts, prompt engineering, and AI studio tooling.',
   '{}', true, 3),
  ('AI & ML Workshop', 'ai-ml-workshop-iit-patna', 'PHN Technology in collaboration with IIT Patna', null, null, 'Specialized Training',
   'Applied machine learning, neural network architectures, and Python data pipelines.',
   '{}', true, 4)
on conflict (slug) do update
  set name            = excluded.name,
      organization    = excluded.organization,
      badge           = excluded.badge,
      description     = excluded.description,
      display_order   = excluded.display_order;

-- ---------------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------------
insert into public.achievements (title, slug, description, metric, link, type, published, display_order)
values
  ('LeetCode Problem Solving',
   'leetcode-problem-solving',
   'Consistent practice on algorithmic problems to strengthen Data Structures & Algorithms fundamentals.',
   '40+ problems solved',
   'https://leetcode.com/u/jyotishyt58/',
   'coding', true, 1)
on conflict (slug) do update
  set title         = excluded.title,
      description   = excluded.description,
      metric        = excluded.metric,
      link          = excluded.link,
      display_order = excluded.display_order;

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------
insert into public.skills (category, name, context, highlight, published, display_order)
values
  ('language', 'Java',           'OOP, Core Syntax, DSA', true,  true, 1),
  ('language', 'JavaScript',     'ES6+, Async/Await, DOM', true,  true, 2),
  ('language', 'TypeScript',     'Type Safety, Interfaces, Generics', true, true, 3),
  ('language', 'Python',         'Scripting', false, true, 4),
  ('language', 'C',              'Systems Programming', false, true, 5),
  ('language', 'C++',            'OOP, STL, Competitive Programming', true, true, 6),
  ('frontend', 'React.js',       'Hooks, State Management, Component Architecture', true, true, 7),
  ('frontend', 'Next.js',        'App Router, Server Components, API Routes', true, true, 8),
  ('frontend', 'HTML5',          'Semantic Markup, Accessibility', false, true, 9),
  ('frontend', 'CSS3',           'Flexbox, Grid, Animations', false, true, 10),
  ('frontend', 'Tailwind CSS',   'Responsive Layouts, Custom Themes', true, true, 11),
  ('backend',  'Node.js',        'Event-driven Runtime, REST APIs', true, true, 12),
  ('backend',  'Express.js',     'Routing, Middleware, API Design', true, true, 13),
  ('backend',  'REST APIs',      'API Design, Authentication', false, true, 14),
  ('backend',  'JWT Auth',       'Authentication, RBAC', true, true, 15),
  ('database', 'PostgreSQL',     'Relational Modeling, Queries, Joins', true, true, 16),
  ('database', 'SQL',            'Query Optimization, Indexing', false, true, 17),
  ('database', 'MongoDB',        'Document Modeling', false, true, 18),
  ('database', 'Drizzle ORM',    'Type-safe Database Access', false, true, 19),
  ('tool',     'Git & GitHub',   'Version Control, Branching, PRs', true, true, 20),
  ('tool',     'VS Code',        'Primary IDE, Extensions', true, true, 21),
  ('tool',     'Postman',        'API Testing & Verification', false, true, 22),
  ('tool',     'Vercel',         'Frontend Deployments', true, true, 23),
  ('tool',     'Figma',          'UI Wireframing, Prototyping', false, true, 24),
  ('core',     'OOP',            'Encapsulation, Inheritance, Polymorphism', true, true, 25),
  ('core',     'Data Structures & Algorithms', 'Trees, Graphs, Recursion, Optimization', true, true, 26),
  ('core',     'DBMS',           'Normalization, Transactions, ACID', false, true, 27),
  ('core',     'Authentication & RBAC', 'JWT, Role-Based Access Control', true, true, 28),
  ('core',     'System Design Basics', 'Caching, Load Balancing Fundamentals', false, true, 29)
on conflict (category, name) do nothing;
