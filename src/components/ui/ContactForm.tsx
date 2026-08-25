"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const projectTypes = [
  "Full-Stack Web App",
  "AI Integration / LLMs",
  "Internship / Job Opportunity",
  "Hackathon Teaming",
  "Other / Just Saying Hi",
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    projectType: projectTypes[0],
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please write a message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          projectType: projectTypes[0],
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send message. Please try again or email directly.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error occurred. Please reach out directly at jyotishyt58@gmail.com.");
    }
  };

  return (
    <div className="relative rounded-3xl bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-10 shadow-xl">
      {status === "success" ? (
        <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Message Sent Successfully!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Thank you for reaching out! Jyotish will get back to you within 24 hours. You can also connect directly on LinkedIn or GitHub.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono"
              >
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 border text-slate-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500",
                  errors.name
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-200 dark:border-white/[0.08]"
                )}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono"
              >
                Your Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 border text-slate-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500",
                  errors.email
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-200 dark:border-white/[0.08]"
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono"
              >
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Full-Stack / Internship Role"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 border text-slate-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500",
                  errors.subject
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-200 dark:border-white/[0.08]"
                )}
              />
              {errors.subject && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Inquiry Type */}
            <div>
              <label
                htmlFor="projectType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono"
              >
                Inquiry Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono"
            >
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, idea, or role..."
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 border text-slate-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y",
                errors.message
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 dark:border-white/[0.08]"
              )}
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Error notification banner */}
          {status === "error" && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <MagneticButton strength={10}>
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </MagneticButton>
        </form>
      )}
    </div>
  );
}
