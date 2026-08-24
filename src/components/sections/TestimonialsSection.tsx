"use client";

import React from "react";
import { testimonialsData } from "@/data/testimonials";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import { Quote, Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Recommendations &amp; Feedback"
          title="Peer &amp; Collaborator Insights"
          subtitle="Feedback from hackathon teammates, tech club peers, and academic mentors on collaboration and execution."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <GlowCard
              key={item.id}
              className="p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {item.badge && <Badge variant="brand">{item.badge}</Badge>}
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-brand-500/20 absolute -top-3 -left-2 -z-10" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.role} &bull; {item.organization}
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
