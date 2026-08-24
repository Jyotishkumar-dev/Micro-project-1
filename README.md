# Jyotish Kumar — Developer Portfolio (Version 2)

A premium, authentic personal developer portfolio for **Jyotish Kumar**, built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

![Portfolio Preview](/public/my_pic2.jpeg)

---

## 🌟 Highlights & Version 2 Design Philosophy

- 📸 **Authentic Visual Anchor**: Integrates Jyotish's real professional photograph (`public/my_pic2.jpeg`) into an editorial hero composition with depth, soft ambient backlighting, and clean typography.
- 🎯 **Honest Student Developer Positioning**: Clear, credible storytelling as a student developer, product builder, and hackathon participant (B.Tech CS - Data Science & ML at SAGE University Indore / ALTA School of Technology).
- 🧭 **Streamlined User Journey**:
  - `Home` &rarr; `About` &rarr; `Projects` &rarr; `Skills` &rarr; `Journey` &rarr; `Contact`
- 💼 **Selected Work with Alternating Rhythm**:
  - **01 / KrishiFleet AI** (SQUidHACK 2026 farm equipment rental platform)
  - **02 / SmartAttend AI** (Multi-role college attendance system with [Live Demo](https://attendance-management-system-projec-steel.vercel.app/login))
  - **03 / HackathonOS** (Real-time hackathon orchestration platform)
- 📖 **Authentic Case Studies**:
  - The Problem &bull; The Idea &bull; What I Built &bull; Key Features &bull; Tech Stack &bull; Real Challenges &bull; Key Learnings.
- 🛠️ **3-Tier Honest Skills Matrix**:
  1. *Technologies I Work With* (Active languages and frameworks)
  2. *Tools I Use* (VS Code, GitHub, Postman, Figma, Vercel, Render)
  3. *Currently Learning & Exploring* (Advanced Java & DSA, System Design, LLM Tool Calling)
- 🗺️ **"The Journey So Far" Growth Timeline**:
  - Vertical storytelling timeline tracking progress from core programming in C++/Java to full-stack systems, hackathons, and building in public.
- 🏆 **Verified Achievements & Activities**:
  - SQUidHACK 2026, IIT Patna AI/ML Workshop, Cisco C++ Essentials 1, TCS iON Young Professional, and UDBHAV'26 Hackathon Core Committee.
- 📬 **Interactive "Get In Touch" Form**:
  - Complete client-side validation, loading states, direct email copy button, and `/api/contact` API route.
- 🌓 **Consistent Light & Dark Theme**:
  - Smooth theme transitions with polished contrast ratios.

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with metadata, JSON-LD, fonts
│   ├── page.tsx               # Main single-page application orchestrator
│   ├── globals.css            # Tailwind theme, CSS variables & scrollbars
│   ├── sitemap.ts             # Dynamic SEO sitemap
│   ├── robots.ts              # Dynamic SEO robots
│   └── api/
│       └── contact/route.ts   # Contact form submission endpoint
├── components/
│   ├── layout/                # Navbar, MobileMenu, Footer, ScrollProgress
│   ├── sections/              # HeroSection, AboutSection, ProjectsSection, SkillsSection, JourneySection, AchievementsSection, ContactSection
│   ├── ui/                    # GlowCard, ProjectModal, ContactForm, ResumeModal, SectionHeading, ThemeToggle, Badge
│   └── providers/             # ThemeProvider (next-themes)
├── data/
│   ├── personal.ts            # Bio, contact, socials, photo references
│   ├── projects.ts            # Projects dataset + honest case studies
│   ├── skills.ts              # 3-tier skills matrix
│   ├── journey.ts             # Growth timeline milestones
│   └── achievements.ts        # Hackathons & certifications
├── hooks/                     # useActiveSection, useScrollPosition
├── lib/                       # Utility helpers (cn)
└── types/                     # Full TypeScript interfaces
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 📝 Updating Your Content

All data is separated from UI components in `src/data/`:
- **Personal Info & Socials**: `src/data/personal.ts`
- **Projects & Case Studies**: `src/data/projects.ts`
- **Skills Matrix**: `src/data/skills.ts`
- **Journey Milestones**: `src/data/journey.ts`
- **Achievements & Certifications**: `src/data/achievements.ts`

---

## 📄 License

Designed and developed by **Jyotish Kumar**.
