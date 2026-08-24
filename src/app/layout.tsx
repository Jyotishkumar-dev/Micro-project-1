import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://jyotishkumar.dev"),
  title: "Jyotish Kumar | Developer & Product Builder",
  description:
    "Portfolio of Jyotish Kumar — a developer focused on building modern web applications, AI-powered products, and meaningful digital experiences.",
  keywords: [
    "Jyotish Kumar",
    "Full Stack Developer",
    "AI Product Engineer",
    "Next.js Developer",
    "React Engineer",
    "TypeScript",
    "KrishiFleet AI",
    "SmartAttend AI",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Jyotish Kumar" }],
  creator: "Jyotish Kumar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jyotishkumar.dev",
    title: "Jyotish Kumar | Developer & Product Builder",
    description:
      "I build modern digital experiences and turn ideas into real products. Explore my projects, skills, case studies, and engineering journey.",
    siteName: "Jyotish Kumar Portfolio",
    images: [
      {
        url: "/my_pic2.jpeg",
        width: 1200,
        height: 630,
        alt: "Jyotish Kumar — Developer & Product Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotish Kumar | Developer & Product Builder",
    description:
      "I build modern digital experiences and turn ideas into real products.",
    images: ["/my_pic2.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jyotish Kumar",
    url: "https://jyotishkumar.dev",
    image: "https://jyotishkumar.dev/my_pic2.jpeg",
    sameAs: [
      "https://github.com/Jyotishkumar-dev",
      "https://www.linkedin.com/in/jyotish-kumar-0601bb387/",
      "https://leetcode.com/u/jyotishyt58/",
      "https://youtube.com/@buildwithjyotish07",
    ],
    jobTitle: "Software Developer & AI Product Builder",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "SAGE University Indore",
    },
    knowsAbout: [
      "Full-Stack Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "AI & LLM Integration",
      "PostgreSQL",
      "Data Structures & Algorithms",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-500 font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
