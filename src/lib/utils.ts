import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Month/year formatter pinned to UTC.
 *
 * `new Date('2026-08-01')` parses as UTC midnight. In any timezone west of
 * Greenwich (UTC-5 and most of the Americas) `toLocaleDateString` would then
 * render "Jul 2026" — a one-month error in every date on the site. Pinning the
 * timeZone makes the stored date render as the date that was actually stored.
 */
export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
