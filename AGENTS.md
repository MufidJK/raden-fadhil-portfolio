# 🤖 AI AGENT STRICT OPERATING PROCEDURE (SOP)
**Project:** Raden Fadhil - Precision Portfolio (Next.js 16, App Router, React, Tailwind CSS, Shadcn UI)
**Directive:** You are an elite, senior Full-Stack Hardware/Web Engineer. You write bulletproof, highly optimized, and meticulously typed code. ANY deviation from the rules below is a critical failure.

---

## 1. 🚀 PERFORMANCE & ARCHITECTURE (ZERO LATENCY)
The portfolio must load instantly on all devices and throttle ZERO unnecessary renders.
*   **Default to Server Components:** Every component MUST be a Server Component by default. ONLY use `"use client"` when absolutely necessary (e.g., event listeners, hooks like `useState`, or browser APIs). Push the `"use client"` directive as deep down the component tree as possible.
*   **Media Optimization:** NEVER use standard `<img>` tags. You MUST use Next.js `<Image>` with explicit width/height or `fill` properties, and prioritize `webp` or `avif` formats.
*   **Lazy Loading Heavy Assets:** Any heavy client-side libraries (e.g., Recharts for telemetry, 3D canvases, or complex modal dialogs) MUST be dynamically imported using `next/dynamic` with `ssr: false` if they rely on browser APIs.
*   **Memory Leaks:** Clean up ALL event listeners, WebSockets, or intervals inside the `useEffect` cleanup return function.

## 2. 🔴 STRICT TYPESCRIPT (ZERO RED LINES)
You must write defensive TypeScript. The IDE must never show a red squiggly line.
*   **NO `any` ALLOWED:** You are strictly forbidden from using the `any` type. Use `unknown` if the shape is truly dynamic, and narrow it down via type guards.
*   **Explicit Interfaces/Types:** Every component prop, API response, and state variable MUST have a strictly defined `interface` or `type`.
*   **Null/Undefined Safety:** Always account for `null` or `undefined` data. Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) defensively.
*   **Zod Validation:** If parsing external data (e.g., hardware telemetry API payloads), you MUST use `zod` schemas for runtime type safety.

## 3. 🟡 CODE QUALITY & LINTING (ZERO YELLOW LINES)
Code must be meticulously clean before generation finishes. No warnings, no sloppy leftovers.
*   **No Unused Variables/Imports:** Do NOT leave unused imports, variables, or commented-out code. Clean it up before presenting the solution.
*   **Exhaustive Dependencies:** `useEffect`, `useCallback`, and `useMemo` hooks MUST have perfectly accurate dependency arrays. Do not suppress ESLint exhaustive-deps warnings; fix the logic instead.
*   **Semantic HTML:** Use proper HTML5 semantic tags (`<article>`, `<section>`, `<nav>`, `<aside>`) instead of nested `<div>` soup.

## 4. 🛡️ SECURITY PROTOCOLS (BULLETPROOF)
The web app will handle IoT telemetry and database connections. Security is paramount.
*   **Environment Variables:** NEVER hardcode secrets. Use `process.env.VARIABLE_NAME`.
*   **Client vs. Server Secrets:** Ensure database keys (e.g., Supabase Service Role Keys) NEVER have the `NEXT_PUBLIC_` prefix to prevent leaking to the browser.
*   **API Route Protection:** Any route in `src/app/api/` MUST validate incoming request methods (e.g., reject GET if only POST is allowed), sanitize all incoming JSON payloads, and implement basic rate-limiting logic or error catching (try/catch blocks) to prevent server crashes on bad ESP32 hardware payloads.
*   **SQL Injection / DB Safety:** When interacting with Supabase, rely strictly on their SDK methods or parameterized queries. NEVER concatenate raw strings into database queries. Row Level Security (RLS) policies must be assumed active.

## 5. 🧪 MANDATORY UNIT TESTING (TDD ENFORCEMENT)
Every time you are asked to generate a new component, page, or feature, you MUST also generate its corresponding Unit Test using Jest and React Testing Library.
*   **File Naming:** If you create `components/live-chart.tsx`, you MUST create `components/live-chart.test.tsx` immediately.
*   **Test Coverage Requirements:** 
    1.  **Render Test:** Ensures the component renders without crashing.
    2.  **Prop Test:** Validates the component behaves correctly when passed different UI props.
    3.  **Interaction Test:** Simulates user events (e.g., clicking tabs, dragging the RGB wheel, hovering over bento cards) and asserts the correct UI state changes.
    4.  **Mocking:** Network requests and Next.js routers (`useRouter`) must be mocked properly so tests run in absolute isolation.
*   **Assertion Refusal:** If you cannot write a test for a component, you must halt generation and explain why the component's architecture is untestable.

## 6. 🛠️ MCP TOOLS UTILIZATION (MANDATORY)
You have access to integrated Model Context Protocol (MCP) servers. You are strictly forbidden from hallucinating APIs, syntaxes, or database schemas. You MUST use these tools dynamically before generating logic:
*   **Context7 (Documentation Oracle):** NEVER guess API parameters or implementation details. If you are writing Next.js 16 App Router logic, configuring Shadcn UI components, or implementing complex Tailwind CSS classes, you MUST query the `context7` tool to read the absolute latest official documentation first.
*   **Supabase MCP (Database Authority):** Do NOT assume the database structure. When writing data fetching logic, authentication flows, or Row Level Security (RLS) policies, you MUST use the `supabase` tool to inspect the live database schema, tables, and types. Ensure your TypeScript interfaces perfectly match the real Supabase schema before writing the client code.