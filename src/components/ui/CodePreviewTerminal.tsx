"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Sparkles, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const codeTabs = [
  {
    id: "overview",
    name: "Jyotish.config.ts",
    icon: Terminal,
    language: "typescript",
    code: `export const developer: EngineerProfile = {
  name: "Jyotish Kumar",
  title: "Developer • Builder • Problem Solver",
  education: "B.Tech CS (Data Science & ML)",
  status: "Available for high-impact opportunities",
  coreStack: {
    frontend: ["Next.js 14", "React 18", "Tailwind CSS", "TypeScript"],
    backend: ["Node.js", "Express", "REST APIs", "JWT RBAC"],
    database: ["PostgreSQL", "Prisma", "MongoDB", "SQL"],
    aiWorkflows: ["LLM Tool Calling", "Gemini & OpenAI APIs", "Prompt Eng."]
  },
  mission: "Turn bold ideas into resilient digital products."
};`,
  },
  {
    id: "krishifleet",
    name: "KrishiFleet.ai",
    icon: Sparkles,
    language: "typescript",
    code: `// KrishiFleet AI - CHC Operations & Equipment Matching
export async function matchMachinery(farmerDemand: CropDemand) {
  const availableFleets = await db.chcHub.findNearest({
    coordinates: farmerDemand.location,
    implements: farmerDemand.machineryRequired,
    status: "DISPATCH_READY"
  });

  const optimizedDispatch = await aiEngine.optimizeDemand({
    cropStage: farmerDemand.cropStage,
    weatherWindow: farmerDemand.forecast,
    fleets: availableFleets
  });

  return optimizedDispatch.createReservation();
}`,
  },
  {
    id: "smartattend",
    name: "SmartAttend.ts",
    icon: Layers,
    language: "typescript",
    code: `// SmartAttend AI - Multi-Role Academic Verification
export async function logBatchAttendance(session: ClassroomSession) {
  const verifiedFaculty = await auth.verifyRBAC(session.instructorId, "FACULTY");
  
  const attendanceLog = await prisma.attendanceRecord.createMany({
    data: session.students.map(std => ({
      studentId: std.id,
      sessionId: session.id,
      status: std.isPresent ? "PRESENT" : "ABSENT",
      timestamp: new Date()
    }))
  });

  await triggerShortageAlerts(session.courseId);
  return { success: true, loggedCount: attendanceLog.count };
}`,
  },
];

export function CodePreviewTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeTabs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950/95 dark:bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden font-mono text-xs sm:text-sm">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-slate-400 text-xs hidden sm:inline-block font-sans font-medium">
            jyotish-workspace ~/workspace
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/60 overflow-x-auto">
          {codeTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-sans whitespace-nowrap",
                  isActive
                    ? "bg-brand-500/20 text-brand-300 font-medium border border-brand-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors ml-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="p-4 sm:p-5 overflow-x-auto text-slate-300 leading-relaxed max-h-[380px]">
        <pre className="selection:bg-brand-500/30">
          <code>
            {codeTabs[activeTab].code.split("\n").map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 select-none text-slate-600 text-right w-6">
                  {i + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {formatCodeLine(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Types Checked • 0 Errors
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-slate-400">UTF-8</span>
        </div>
        <div className="flex items-center gap-2 text-brand-300">
          <Cpu className="w-3 h-3" />
          <span>Next.js 14 Runtime</span>
        </div>
      </div>
    </div>
  );
}

// Simple syntax highlighting helper for aesthetic styling
function formatCodeLine(line: string) {
  if (line.trim().startsWith("//")) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.includes("export const") || line.includes("export async function")) {
    return (
      <span>
        <span className="text-purple-400">export </span>
        <span className="text-cyan-400">
          {line.includes("const") ? "const " : "async function "}
        </span>
        <span className="text-amber-300">
          {line.replace(/export (const|async function) /, "")}
        </span>
      </span>
    );
  }
  if (line.includes("await") || line.includes("return")) {
    return (
      <span>
        {line.split(/(await|return)/g).map((part, index) => {
          if (part === "await" || part === "return") {
            return (
              <span key={index} className="text-purple-400 font-medium">
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  }
  if (line.includes(":")) {
    const parts = line.split(":");
    return (
      <span>
        <span className="text-cyan-300">{parts[0]}</span>:
        <span className="text-slate-200">{parts.slice(1).join(":")}</span>
      </span>
    );
  }
  return <span>{line}</span>;
}
