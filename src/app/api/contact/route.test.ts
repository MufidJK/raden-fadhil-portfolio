/**
 * @jest-environment node
 */

import { POST, rateLimiter, containsHeaderInjection, contactFormSchema } from "./route";

// ---------------------------------------------------------------------------
// Mock the Resend module (AGENTS.md Rule 5 — Mocking)
// ---------------------------------------------------------------------------

const mockSend = jest.fn();

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: unknown, headers?: Record<string, string>): Request {
  const headersObj = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: headersObj,
    body: JSON.stringify(body),
  });
}

const validPayload = {
  fullName: "Sarah Jenkins",
  email: "sarah@techcorp.io",
  subject: "Custom PCB Layout",
  message: "I need a custom PCB layout for my IoT project with LoRaWAN support.",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimiter.reset();
    process.env.RESEND_API_KEY = "re_test_key";
    mockSend.mockResolvedValue({ data: { id: "mock-email-id" }, error: null });
  });

  afterAll(() => {
    delete process.env.RESEND_API_KEY;
  });

  // -----------------------------------------------------------------------
  // 1. Valid submission succeeds
  // -----------------------------------------------------------------------
  it("returns 200 and calls Resend on a valid submission", async () => {
    const request = makeRequest(validPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["radenfadhiltriansyah99@gmail.com"],
        replyTo: "sarah@techcorp.io",
        subject: "[Portfolio Contact] Custom PCB Layout",
      })
    );
  });

  // -----------------------------------------------------------------------
  // 2. Invalid payload is rejected by Zod (400)
  // -----------------------------------------------------------------------
  it("returns 400 with formatted errors when payload fails Zod validation", async () => {
    const request = makeRequest({
      fullName: "",
      email: "not-an-email",
      subject: "",
      message: "short",
    });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Validation failed");
    expect(json.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "fullName" }),
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "subject" }),
        expect.objectContaining({ field: "message" }),
      ])
    );
    expect(mockSend).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // 3. Honeypot-filled submission silently succeeds but does NOT call Resend
  // -----------------------------------------------------------------------
  it("returns 200 but does NOT call Resend when honeypot is filled", async () => {
    const request = makeRequest({
      ...validPayload,
      honeypot: "I am a bot",
    });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockSend).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // 4. 4th submission within the 10-minute window returns 429
  // -----------------------------------------------------------------------
  it("returns 429 on the 4th request within the rate-limit window", async () => {
    const ip = "192.168.1.1";
    const headers = { "x-forwarded-for": ip };

    // First 3 should succeed
    for (let i = 0; i < 3; i++) {
      const req = makeRequest(validPayload, headers);
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 4th should be rate-limited
    const req = makeRequest(validPayload, headers);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Too many requests");
    expect(mockSend).toHaveBeenCalledTimes(3); // Only the first 3 triggered send
  });

  // -----------------------------------------------------------------------
  // 5. Submission with \r or \n in header fields (subject/email) is rejected
  // -----------------------------------------------------------------------
  it("returns 400 when subject contains newline characters", async () => {
    const request = makeRequest({
      ...validPayload,
      subject: "Injected\r\nBcc: attacker@evil.com",
    });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("subject");
    expect(json.error).toContain("newline");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 when email contains newline characters", async () => {
    const request = makeRequest({
      ...validPayload,
      email: "user@test.com\nBcc: attacker@evil.com",
    });
    const response = await POST(request);
    const json = await response.json();

    // Zod should reject this as invalid email format first,
    // but if it somehow passes, the header injection check catches it
    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 when fullName contains newline characters", async () => {
    const request = makeRequest({
      ...validPayload,
      fullName: "John\r\nEvil",
    });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("fullName");
    expect(mockSend).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // Additional edge-case tests
  // -----------------------------------------------------------------------
  it("returns 400 on malformed JSON body", async () => {
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json{{{",
    });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid JSON in request body");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 500 when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;

    const request = makeRequest(validPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Server configuration error");
    expect(mockSend).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Unit tests for exported utility functions
// ---------------------------------------------------------------------------

describe("containsHeaderInjection", () => {
  it("returns false for clean strings", () => {
    expect(containsHeaderInjection("Hello World")).toBe(false);
    expect(containsHeaderInjection("sarah@test.com")).toBe(false);
  });

  it("returns true for strings containing \\n", () => {
    expect(containsHeaderInjection("Hello\nWorld")).toBe(true);
  });

  it("returns true for strings containing \\r", () => {
    expect(containsHeaderInjection("Hello\rWorld")).toBe(true);
  });

  it("returns true for strings containing \\r\\n", () => {
    expect(containsHeaderInjection("Hello\r\nWorld")).toBe(true);
  });
});

describe("contactFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a name over 100 characters", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      fullName: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      email: "not-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message over 5000 characters", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      message: "A".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});
