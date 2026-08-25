# Jyotish Kumar — Developer Portfolio (Version 3)

A modern, highly polished personal developer portfolio for **Jyotish Kumar**, built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP & ScrollTrigger**, and custom **interactive HTML5 canvas animations**.

![Portfolio Preview](/public/my_pic2.jpeg)

---

## 🌟 Version 3 Upgrades & Key Features

- 🌌 **Deep Dark Navy / Midnight Blue Palette (`#0A1020` / `#101429`)**: Inspired by the dark navy HackathonOS presentation aesthetic, featuring rich midnight surfaces, slate depth layers, and electric indigo/cyan accents.
- ✨ **Interactive Animated Background (`InteractiveBackground.tsx`)**: Lightweight 60fps HTML5 canvas rendering floating digital constellation nodes with soft connecting lines and dynamic mouse proximity response. Automatically throttles on mobile and hidden tabs.
- 💡 **Fluid Cursor-Following Radial Glow (`CursorLight.tsx`)**: Smooth interpolated (lerp) radial light tracking the mouse without blocking clicks, seamlessly adapting in intensity when hovering interactive cards and CTAs.
- 🎬 **Mandatory GSAP & ScrollTrigger Integration (`gsap.ts`)**:
  - **Hero Section**: Staggered cinematic entrance timeline (badge &rarr; headline reveal &rarr; narrative &rarr; magnetic CTAs &rarr; real photo frame reveal).
  - **Section Headings**: ScrollTrigger-based reveal animations.
  - **Projects Section**: Scroll-driven entrance with subtle image depth parallax.
  - **Journey Section**: Scroll-driven vertical timeline progress line expanding in real time as the user scrolls.
  - **Magnetic Button Effects (`MagneticButton.tsx`)**: Subtle magnetic attraction micro-interactions for primary CTAs (`View My Work`, `Let's Connect`).
- 📸 **Real Professional Photo**: Preserves and frames Jyotish's real photograph (`public/my_pic2.jpeg`) with ambient backlighting and degree context (*B.Tech CS - Data Science & ML*).
- 🧭 **Streamlined User Journey**:
  - `Home` &rarr; `About` &rarr; `Projects` &rarr; `Skills` &rarr; `Journey` &rarr; `Contact`
- 💼 **Authentic Featured Projects**:
  - **01 / KrishiFleet AI** (SQUidHACK 2026 farm equipment rental platform)
  - **02 / SmartAttend AI** (Multi-role college attendance system with [Live Demo](https://attendance-management-system-projec-steel.vercel.app/login))
  - **03 / HackathonOS** (Real-time hackathon orchestration platform)
- 🛠️ **3-Tier Honest Skills Matrix**:
  1. *Technologies I Work With* (Active languages and frameworks)
  2. *Tools I Use* (VS Code, GitHub, Postman, Figma, Vercel, Render)
  3. *Currently Learning & Exploring* (Advanced Java & DSA, System Design, LLM Tool Calling)
- 📬 **Interactive Contact System**:
  - Form with client-side validation, loading states, and direct email copy button (`jyotishyt58@gmail.com`), backed by `/api/contact`.

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with metadata, JSON-LD, fonts
│   ├── page.tsx               # Main single-page application orchestrator
│   ├── globals.css            # Dark navy theme variables, CSS utilities & scrollbars
│   ├── sitemap.ts             # Dynamic SEO sitemap
│   ├── robots.ts              # Dynamic SEO robots
│   └── api/
│       └── contact/route.ts   # Contact form submission endpoint
├── components/
│   ├── layout/                # Navbar, MobileMenu, Footer, ScrollProgress
│   ├── sections/              # HeroSection, AboutSection, ProjectsSection, SkillsSection, JourneySection, AchievementsSection, ContactSection
│   ├── ui/                    # InteractiveBackground, CursorLight, MagneticButton, GlowCard, ProjectModal, ContactForm, ResumeModal, SectionHeading, ThemeToggle, Badge
│   └── providers/             # ThemeProvider (next-themes)
├── data/
│   ├── personal.ts            # Bio, contact, socials, photo references
│   ├── projects.ts            # Projects dataset + honest case studies
│   ├── skills.ts              # 3-tier skills matrix
│   ├── journey.ts             # Growth timeline milestones
│   └── achievements.ts        # Hackathons & certifications
├── hooks/                     # useActiveSection, useScrollPosition
├── lib/                       # gsap.ts (GSAP & ScrollTrigger), utils.ts
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

## 📄 License

Designed and developed by **Jyotish Kumar**.
