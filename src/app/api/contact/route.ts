import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServerConfigured } from "@/lib/supabase/env.server";
import {
  contactMessageSchema,
  firstErrorMessage,
} from "@/lib/validation/schemas";

/**
 * Public contact intake.
 *
 * Why this is a Route Handler instead of a direct browser insert:
 *  • spam scoring has to run before the row is written, and the RLS policy
 *    deliberately forbids a caller from setting `spam` itself — so the verdict
 *    has to be made with server privilege;
 *  • the honeypot field and rate limiter can be enforced in one place instead of
 *    being replicated in every client;
 *  • the service role key stays on the server. The browser never sees it.
 *
 * The anon-key INSERT policy (`contact_messages_public_insert`) still exists in
 * the database, so a direct PostgREST insert is possible and is still RLS-gated
 * — this route is the hardened path, not the only one.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limiting
//
// Best-effort and per-instance. On serverless the isolate is recycled, so this
// stops casual scripted bursts rather than a determined attacker. Real
// enforcement would put a limit at the CDN or Supabase edge.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// ---------------------------------------------------------------------------
// Heuristics — cheap, explainable signals. None of these is a real filter; they
// exist to keep obvious junk out of the inbox.
// ---------------------------------------------------------------------------

function scoreSpam(input: {
  website?: string;
  message: string;
  body: string;
}): boolean {
  // Honeypot: a hidden field only an automated client would fill in.
  if (input.website && input.website.length > 0) return true;

  const message = input.message;
  const lowerBody = input.body.toLowerCase();

  // Link stuffing.
  const links = message.match(/https?:\/\//gi)?.length ?? 0;
  if (links >= 2) return true;

  // No spaces at all in a long body is not something a human writes.
  if (message.length > 40 && !/\s/.test(message)) return true;

  // Single character repeated to pad the body.
  if (/(.)\1{9,}/.test(message)) return true;

  // Blocklist of the usual subjects.
  const spamPhrases = [
    "seo services",
    "backlinks",
    "crypto giveaway",
    "viagra",
    "casino bonus",
    "work from home and earn",
    "buy followers",
  ];
  if (spamPhrases.some((phrase) => lowerBody.includes(phrase))) return true;

  return false;
}

// ---------------------------------------------------------------------------

const SUCCESS_RESPONSE = {
  success: true,
  message: "Your message has been received! Jyotish will get back to you shortly.",
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = contactMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: firstErrorMessage(parsed.error) },
      { status: 400 }
    );
  }

  const { name, email, subject, projectType, message, website } = parsed.data;
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    // 429 with the same generic body, so a bot learns nothing about the rules.
    return NextResponse.json(
      {
        success: false,
        message: "Too many messages sent recently. Please try again in a few minutes.",
      },
      { status: 429 }
    );
  }

  const spam = scoreSpam({
    website,
    message,
    body: JSON.stringify(body),
  });

  if (!isSupabaseServerConfigured()) {
    console.error(
      "[contact] Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY."
    );
    return NextResponse.json(
      {
        success: false,
        message:
          "The contact form is temporarily unavailable. Please email me directly at jyotishyt58@gmail.com.",
      },
      { status: 503 }
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        message:
          "The contact form is temporarily unavailable. Please email me directly at jyotishyt58@gmail.com.",
      },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    project_type: projectType || null,
    message,
    spam,
    user_agent: request.headers.get("user-agent"),
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return NextResponse.json(
      {
        success: false,
        message:
          "Your message could not be saved. Please email me directly at jyotishyt58@gmail.com.",
      },
      { status: 500 }
    );
  }

  // Server-side log for the owner's own visibility. Never includes the key.
  console.log("[contact] stored", {
    name,
    email,
    subject,
    spam,
    at: new Date().toISOString(),
  });

  // Identical response whether or not the message was flagged, so a spammer
  // gets no signal that the heuristic fired.
  return NextResponse.json(SUCCESS_RESPONSE, { status: 200 });
}
