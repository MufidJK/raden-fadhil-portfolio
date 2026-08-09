import { Resend } from "resend";
import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Zod schema — validates incoming POST body (AGENTS.md Rule 2)
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be at most 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
  honeypot: z.string().optional(),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

// ---------------------------------------------------------------------------
// Email header injection prevention (AGENTS.md Rule 4)
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the value contains CR (`\r`) or LF (`\n`) characters,
 * which could be exploited for email header injection.
 */
export function containsHeaderInjection(value: string): boolean {
  return /[\r\n]/.test(value);
}

// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter (AGENTS.md Rule 4)
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  timestamps: number[];
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  constructor(
    private readonly maxRequests: number = 3,
    private readonly windowMs: number = 10 * 60 * 1000 // 10 minutes
  ) {}

  /**
   * Returns `true` if the request should be allowed, `false` if rate-limited.
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      this.store.set(key, { timestamps: [now] });
      return true;
    }

    // Prune timestamps outside the window
    entry.timestamps = entry.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );

    if (entry.timestamps.length >= this.maxRequests) {
      return false;
    }

    entry.timestamps.push(now);
    return true;
  }

  /** Resets all state — used in tests for isolation between test cases. */
  reset(): void {
    this.store.clear();
  }
}

// Singleton rate limiter for the route
export const rateLimiter = new RateLimiter(3, 10 * 60 * 1000);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const RECIPIENT_EMAIL = "radenfadhiltriansyah99@gmail.com";
const SENDER_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

// ---------------------------------------------------------------------------
// Formatted Zod error response
// ---------------------------------------------------------------------------

interface FormattedFieldError {
  field: string;
  message: string;
}

function formatZodErrors(error: z.ZodError): FormattedFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

// ---------------------------------------------------------------------------
// POST handler (only export — Next.js returns 405 for unlisted methods)
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<Response> {
  // 1. Parse JSON body — catch malformed JSON (AGENTS.md Rule 4)
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  // 2. Validate with Zod (AGENTS.md Rule 2)
  const parsed = contactFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        details: formatZodErrors(parsed.error),
      },
      { status: 400 }
    );
  }

  const { fullName, email, subject, message, honeypot } = parsed.data;

  // 3. Honeypot check — silent accept, no email sent (anti-bot)
  if (honeypot && honeypot.length > 0) {
    return Response.json({ success: true });
  }

  // 4. Email header injection prevention (AGENTS.md Rule 4)
  const headerFields = { fullName, email, subject };
  for (const [fieldName, value] of Object.entries(headerFields)) {
    if (containsHeaderInjection(value)) {
      return Response.json(
        {
          success: false,
          error: `Invalid characters in ${fieldName}: newline characters are not allowed`,
        },
        { status: 400 }
      );
    }
  }

  // 5. Rate limiting — 3 requests per IP per 10 minutes
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimiter.isAllowed(ip)) {
    return Response.json(
      {
        success: false,
        error: "Too many requests. Please try again later.",
      },
      { status: 429 }
    );
  }

  // 6. Verify API key exists (server-only — AGENTS.md Rule 4)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY environment variable is not set");
    return Response.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  // 7. Send email via Resend SDK
  const resend = new Resend(apiKey);
  const { error: sendError } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [RECIPIENT_EMAIL],
    replyTo: email,
    subject: `[Portfolio Contact] ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (sendError) {
    console.error("Resend send error:", sendError);
    return Response.json(
      { success: false, error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}

// ---------------------------------------------------------------------------
// HTML escaping for email body content
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
