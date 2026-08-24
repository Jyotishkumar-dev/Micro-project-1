# Jyotish Kumar — Modern Developer Portfolio

A premium, highly interactive personal developer portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

![Portfolio Preview](/public/my_pic2.jpeg)

---

## 🌟 Highlights & Features

- ⚡ **Futuristic & Clean Design**: Neutral obsidian dark palette with subtle cyan & indigo accents, glassmorphism, and seamless light/dark mode switching.
- 🎯 **Personal Branding**: Focused storytelling around Jyotish Kumar (Developer • Builder • Problem Solver).
- 🧭 **Sticky Navigation with Scroll Depth**: Real-time active section highlighting, top scroll progress bar, and blur-on-scroll effects.
- 💻 **Interactive Code Terminal Workspace**: Interactive tab switcher previewing `Jyotish.config.ts`, `KrishiFleet.ai`, and `SmartAttend.ts` code snippets.
- 📦 **Featured Projects & In-Depth Case Studies**: Filterable project gallery (`All`, `AI & ML`, `Full Stack`, `Hackathons`) with a deep Case Study modal covering problem statements, architecture, tech stack, 6-phase development pipelines, technical challenges, and takeaways.
- 🛠️ **Categorized Skills Matrix**: Programming, Frontend, Backend, Databases, Developer Tools, and AI Workflows with proficiency indicators.
- 🏆 **Hackathons & Achievements**: Showcase for SQUidHACK 2026, IIT Patna AI/ML workshop, Cisco C++, and TCS iON credentials.
- 📈 **GitHub & Open Source Insights**: Repository stats, commit activity overview, and primary language ecosystem breakdown.
- 🗺️ **"Always Building. Always Learning." Roadmap**: Interactive milestone timeline displaying mastered, active, and upcoming focus topics.
- 📬 **Interactive "Get in Touch" Form**: Complete client-side validation, error handling, confetti celebration, and a working `/api/contact` endpoint.
- ⌨️ **Command Palette (`⌘K` / `Ctrl+K`)**: Keyboard-driven quick jump menu to navigate sections, toggle theme, copy email, or preview resume.
- 📄 **Resume Preview Modal**: Interactive PDF viewer and download trigger for `resume.pdf`.
- 🔍 **SEO & Metadata**: JSON-LD Structured Data (`Person` schema), dynamic Open Graph tags, sitemap (`/sitemap.xml`), and robots (`/robots.txt`).

---

## 🏗️ Architecture & Structured Data

All portfolio content is separated cleanly from UI components in `src/data/`, allowing effortless updates without modifying layouts:

```
src/
├── app/
│   ├── layout.tsx             # Root layout with fonts, metadata, JSON-LD
│   ├── page.tsx               # Main single-page application orchestrator
│   ├── globals.css            # Tailwind theme, CSS variables & scrollbars
│   ├── sitemap.ts             # Dynamic SEO sitemap
│   ├── robots.ts              # Dynamic SEO robots
│   └── api/
│       └── contact/route.ts   # Contact form submission endpoint
├── components/
│   ├── layout/                # Navbar, MobileMenu, Footer, ScrollProgress, CommandPalette
│   ├── sections/              # Hero, About, Skills, Projects, Experience, Achievements, Github, Roadmap, Testimonials, Contact
│   ├── ui/                    # GlowCard, ProjectCard, ProjectModal, ContactForm, ResumeModal, CodeTerminal, ThemeToggle
│   └── providers/             # ThemeProvider (next-themes)
├── data/
│   ├── personal.ts            # Bio, rotating roles, socials, stats
│   ├── projects.ts            # Projects dataset + complete case studies
│   ├── skills.ts              # Categorized tech stacks & tools
│   ├── experience.ts          # Leadership & work timeline
│   ├── achievements.ts        # Hackathons & certifications
│   ├── learning.ts            # Growth milestones & topics
│   └── testimonials.ts        # Peer recommendations
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

- **Personal Details & Social Links**: Edit `src/data/personal.ts`
- **Add or Edit Projects**: Edit `src/data/projects.ts`
- **Update Skills**: Edit `src/data/skills.ts`
- **Add Experiences / Leadership**: Edit `src/data/experience.ts`
- **Add Achievements / Hackathons**: Edit `src/data/achievements.ts`
- **Update Learning Roadmap**: Edit `src/data/learning.ts`

---

## 📄 License

Designed and built by **Jyotish Kumar**. Free to use and customize.
