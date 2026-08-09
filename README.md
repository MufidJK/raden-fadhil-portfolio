<p align="center">
  <img src="public/logo.svg" alt="Raden Fadhil Logo" width="120" />
</p>

<h1 align="center">Raden Fadhil Portfolio Web</h1>

<p align="center">
  <strong>High-Performance Hardware Engineering & Full-Stack IoT Portfolio with Live Admin CMS & Telemetry Dashboard</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=nextdotjs" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-v2.111.0-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
</p>

---

## 📌 About

**Raden Fadhil Portfolio** is a state-of-the-art web application engineered to bridge hardware engineering and modern full-stack web development. Designed for high performance and zero-latency visual telemetry, it showcases embedded systems projects, IoT firmware implementations, microcontrollers (ESP32/STM32), and web applications. It includes an integrated authentication-protected CMS for real-time project management and direct media uploads.

---

## ✨ Features

- 🎨 **Theme Engine & Custom Ambient RGB Picker:** Dynamic light/dark mode switching powered by `next-themes`, paired with an interactive RGB color wheel picker widget (`ThemeSyncWidget`) to dynamically update site-wide ambient glow and accent colors in real time.
- 📦 **Resilient Supabase Project Showcase:** Real-time database integration querying project records from Supabase, featuring automatic seamless fallback to a rich static dataset (`MOCK_PROJECTS`) ensuring zero downtime when the database is unpopulated or unreachable.
- 🎬 **Dynamic Project Detail Pages & Multi-Media Carousel:** SSR-rendered dynamic routes at `/projects/[slug]` featuring interactive Embla carousels with autoplay support for multi-image showcases and embedded demo videos alongside technical hardware specifications.
- 🔒 **Auth-Protected Admin CMS & Media Dropzone:** Secure `/admin` portal guarded by Next.js Proxy middleware and `@supabase/ssr` cookie sessions. Includes drag-and-drop media upload (`media-dropzone.tsx`) direct to Supabase Storage (`portfolio-media`), project creation, update forms, and deletion confirmation dialogs.
- 🛡️ **Hardened Contact Form API:** Robust contact interface built with React Hook Form and Zod validation, fortified against spam through a hidden honeypot trap field and in-memory client IP rate-limiting, delivering messages via Resend email API.
- 📊 **Real-Time IoT Telemetry Dashboard:** Live hardware telemetry widget (`TelemetryWidget`) rendering simulated real-time microcontroller CPU load, RAM allocation, sensor node activity, and system power metrics.
- 🧪 **Bulletproof TDD Test Suite:** Meticulously typed codebase backed by a comprehensive unit test suite built with Jest and React Testing Library covering UI components, form validation, and server route handlers.

---

## 🛠️ Tech Stack

| Category            | Technology                   | Locked Version       | Description                                             |
| :------------------ | :--------------------------- | :------------------- | :------------------------------------------------------ |
| **Framework**       | Next.js                      | `16.2.9`             | App Router, Server Components, React Compiler           |
| **Library**         | React / React DOM            | `19.2.4`             | Component UI library & DOM renderer                     |
| **Language**        | TypeScript                   | `5.9.3`              | Strict static typing system                             |
| **Styling**         | Tailwind CSS                 | `4.3.2`              | Utility-first CSS engine with `@tailwindcss/postcss`    |
| **UI Components**   | Shadcn UI / Radix            | `4.12.0`             | Accessible primitive components & Radix UI icons        |
| **Animations**      | Framer Motion                | `12.42.2`            | Dynamic layout animations and scroll reveals            |
| **Carousel**        | Embla Carousel               | `8.6.0`              | Smooth touch-enabled media slider with autoplay         |
| **Database & Auth** | Supabase JS / SSR            | `2.111.0` / `0.12.4` | PostgreSQL database, Storage bucket, and SSR Auth       |
| **Forms**           | React Hook Form              | `7.80.0`             | Performant client form state management                 |
| **Validation**      | Zod                          | `4.4.3`              | Schema declaration and payload validation               |
| **Email**           | Resend                       | `6.18.1`             | Email delivery service SDK for contact form             |
| **Testing**         | Jest / React Testing Library | `30.4.2` / `16.3.2`  | Test runner, DOM assertion setup, and jsdom environment |

---

## 🚀 Getting Started

### Prerequisites

Ensure your environment satisfies the following requirements:

- **Node.js:** `>= 18.18.0` or `>= 20.9.0` (Recommended: `Node.js v20+` or `v24+`)
- **Package Manager:** `npm` (`v10+`)

### 1. Installation

Clone the repository and install all locked dependencies:

```bash
git clone https://github.com/MufidJK/raden-fadhil-portfolio.git
cd raden-fadhil-portfolio
npm install
```

### 2. Environment Setup

Copy the `.env.example` template to create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and populate the required API credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=re_your_resend_api_key
```

> 🔑 **Where to find API Keys:**
>
> - **Supabase Keys:** Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **API**. Copy the `URL`, `anon` key, and `service_role` key.
> - **Resend API Key:** Log in to your [Resend Dashboard](https://resend.com/api-keys) and create a new API key.

### 3. Run Development Server

Start the local development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

---

## 📜 Available Scripts

Run any of the following scripts using `npm run <script-name>`:

| Script       | Command        | Purpose                                                                     |
| :----------- | :------------- | :-------------------------------------------------------------------------- |
| `dev`        | `next dev`     | Launches Next.js development server with hot-reloading at `localhost:3000`. |
| `prebuild`   | `rm -rf .next` | Automatically cleans cached `.next` build output prior to compilation.      |
| `build`      | `next build`   | Compiles the production build bundle.                                       |
| `start`      | `next start`   | Starts the production server for pre-built assets.                          |
| `lint`       | `eslint`       | Executes ESLint to check for syntax and style issues.                       |
| `test`       | `jest`         | Runs unit tests across all test suites.                                     |
| `test:watch` | `jest --watch` | Runs Jest test runner in continuous interactive watch mode.                 |

---

## 📂 Project Structure

```
raden-fadhil-portfolio/
├── public/                  # Static public assets (logo.svg, OpenGraph images)
├── src/
│   ├── proxy.ts             # Next.js Proxy Middleware (Supabase auth session refresh & route protection)
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout, ThemeProvider, TopNav, SiteFooter, Sonner toaster
│   │   ├── page.tsx         # Homepage (Hero, Telemetry, Capabilities, Showcase Grid, Contact)
│   │   ├── admin/           # Auth-guarded admin CMS routes (/login, /projects, /upload)
│   │   ├── api/             # API routes (/api/contact, /api/projects)
│   │   └── projects/        # Dynamic project detail routes (/projects/[slug])
│   ├── components/          # React components
│   │   ├── admin/           # CMS management lists, delete modals, upload wrappers
│   │   ├── dashboard/       # Telemetry widgets and RGB theme color sync wheel
│   │   ├── projects/        # Project card, grid client, media carousel, category filter tabs
│   │   └── ui/              # Shadcn UI primitives (button, dialog, sheet, form, badge, etc.)
│   ├── lib/                 # Core domain logic
│   │   ├── custom-theme-color.tsx # Custom RGB color wheel accent logic
│   │   ├── supabase.ts      # Client-side Supabase instance
│   │   ├── supabase-admin.ts# Service-role administrative Supabase client
│   │   └── data/            # Mock dataset fallback, telemetry aggregator & query helpers
│   └── utils/
│       └── supabase/        # SSR Supabase client, server, and middleware helpers
├── .env.example             # Template for required environment variables
├── next.config.ts           # Next.js configuration (React Compiler, Remote Image patterns)
├── jest.config.ts           # Jest configuration
└── package.json             # Locked dependencies and scripts
```

---

## 🧪 Testing

The repository relies on Jest and React Testing Library for Unit and Component integration testing.

```bash
# Run all unit tests once
npm run test

# Run tests in continuous watch mode during development
npm run test:watch
```

---

## 🌐 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com).

### Deployment Steps on Vercel:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Set the **Framework Preset** to **Next.js**.
4. Configure the **Environment Variables** in Vercel settings (add all 4 keys from `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
5. Click **Deploy**.

---

## 📬 Contact

**Raden Fadhil Triansyah** — _Hardware Engineer & IoT Full-Stack Developer_

- 📧 **Email:** [radenfadhiltriansyah99@gmail.com](mailto:radenfadhiltriansyah99@gmail.com)
- 📸 **Instagram:** [@biji_tech](https://instagram.com/biji_tech)
- 💼 **LinkedIn:** [Raden Fadhil Triansyah](https://linkedin.com/in/raden-fadhil-triansyah)
