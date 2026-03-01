# Vibe

An AI-powered app and website builder. Describe what you want to build in plain English, and Vibe generates a fully working application with a live preview — no coding required.

## Features

- **AI-powered code generation** — Chat with an AI agent to create full-stack apps and websites
- **Live sandbox previews** — Every generated app runs in an isolated E2B sandbox with a shareable URL
- **Project management** — Organize work into projects with full message history
- **Iterative development** — Continue the conversation to refine and extend any generated app
- **Usage tiers** — Free (2 generations / 30 days) and Pro (100 generations / 30 days) plans via Clerk billing

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript + React 19 |
| API | tRPC v11 + React Query |
| Database | PostgreSQL via Prisma |
| Auth & Billing | Clerk |
| AI Agent | Inngest AgentKit |
| LLM | OpenRouter (stepfun/step-3.5-flash by default) |
| Code Execution | E2B Code Interpreter |
| UI | shadcn/ui + Tailwind CSS v4 |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── (home)/           # Landing, pricing, auth pages
│   └── projects/[id]/    # Per-project chat & preview page
├── components/           # Shared UI components
├── constants/            # AI prompts and model config
├── inngest/              # Background AI agent function
├── lib/                  # Prisma client, usage tracking, utilities
├── modules/              # Feature modules (home, messages, projects, usage)
├── trpc/                 # tRPC router setup and client/server contexts
└── types/                # Shared TypeScript types
prisma/
└── schema.prisma         # Database schema (Project, Message, Fragment, Usage)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Accounts for: [Clerk](https://clerk.com), [Inngest](https://inngest.com), [E2B](https://e2b.dev), [OpenRouter](https://openrouter.ai)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vibe"

# Clerk (auth & billing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Inngest (background job processing)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# E2B (sandboxed code execution)
E2B_API_KEY=...

# OpenRouter (LLM)
OPENROUTER_API_KEY=...
```

### 3. Set up the database

```bash
pnpm dlx prisma migrate dev
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To process background AI jobs locally, run the Inngest dev server in a separate terminal:

```bash
pnpm dlx inngest-cli@latest dev
```

## How It Works

1. A user describes an app they want to build and submits a message.
2. An Inngest background function spins up an E2B sandbox and runs an AI agent loop powered by OpenRouter.
3. The agent iteratively writes, reads, and edits files inside the sandbox until the app is complete.
4. The resulting files and a live preview URL are saved as a `Fragment` attached to the message.
5. The user can view the live preview and continue the conversation to make changes.

## Configuration

Model selection and agent parameters live in [src/constants/config.ts](src/constants/config.ts). You can swap the `model` field to any OpenRouter-compatible model ID.

## Deployment

Deploy to [Vercel](https://vercel.com) with the standard Next.js preset. Make sure to:

1. Add all environment variables from `.env.local` to your Vercel project settings.
2. Enable the [Inngest Vercel integration](https://www.inngest.com/docs/deploy/vercel) so background jobs are processed in production.
3. Make sure your E2B sandbox template (`vibe`) exists in your E2B account.
