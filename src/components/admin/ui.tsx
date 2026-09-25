"use client";

import React, { useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Inbox,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared admin UI primitives.
 *
 * Deliberately plain and small. The admin is a tool, not a showpiece: dense
 * rows, obvious affordances, no decorative motion. Every interactive element
 * here is a real `<button>`/`<input>` with a visible focus ring and a label, so
 * the whole dashboard is keyboard-navigable.
 */

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-navy-800/70",
        className
      )}
    >
      {children}
    </section>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          {description}
        </p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export function Banner({
  tone,
  children,
  onDismiss,
}: {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  const tones = {
    error: "bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300",
    success:
      "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300",
    info: "bg-brand-500/10 border-brand-500/25 text-brand-700 dark:text-brand-300",
  };

  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-xl border text-sm",
        tones[tone]
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-14 px-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-14 text-sm text-slate-500 dark:text-slate-400">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{label}…</span>
    </div>
  );
}

export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-14 rounded-xl bg-slate-100 dark:bg-white/[0.04] animate-pulse"
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  loading = false,
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand-600 hover:bg-brand-500 text-white border border-transparent shadow-sm",
    secondary:
      "bg-white dark:bg-navy-750 hover:bg-slate-50 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/[0.08]",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border border-transparent",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white border border-transparent shadow-sm",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variants[variant],
        className
      )}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cn(
        "p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Reorder arrows. Keyboard reachable, unlike drag-only controls. */
export function ReorderControls({
  index,
  total,
  onMove,
  busy,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  busy?: boolean;
}) {
  return (
    <div className="flex items-center">
      <IconButton
        label="Move up"
        disabled={busy || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ChevronUp className="w-4 h-4" />
      </IconButton>
      <IconButton
        label="Move down"
        disabled={busy || index === total - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ChevronDown className="w-4 h-4" />
      </IconButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900/60 border text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500";

export function TextInput({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        invalid
          ? "border-rose-500 focus:ring-rose-500"
          : "border-slate-200 dark:border-white/[0.08]",
        className
      )}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        "resize-y min-h-[80px]",
        invalid
          ? "border-rose-500 focus:ring-rose-500"
          : "border-slate-200 dark:border-white/[0.08]",
        className
      )}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        invalid
          ? "border-rose-500 focus:ring-rose-500"
          : "border-slate-200 dark:border-white/[0.08]",
        className
      )}
    >
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          checked ? "bg-brand-600" : "bg-slate-300 dark:bg-navy-600"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status pill
// ---------------------------------------------------------------------------

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    neutral:
      "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10",
    brand:
      "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog so a keyboard user is not left behind it.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative w-full my-auto rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/[0.08] shadow-2xl focus:outline-none",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 px-5 py-4 bg-white dark:bg-navy-800 rounded-t-2xl border-b border-slate-200 dark:border-white/[0.08]">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/** Two-step destructive action: click once to arm, again to confirm. */
export function ConfirmButton({
  onConfirm,
  children,
  disabled,
  className,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const [armed, setArmed] = React.useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <Button
      variant={armed ? "danger" : "ghost"}
      size="sm"
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      className={className}
    >
      {armed ? "Confirm?" : children}
    </Button>
  );
}
