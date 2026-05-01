<div align="center">

# ⚽ UOM Football War Room

**Real-time football fan engagement platform — built as a production-grade full-stack portfolio project**

[![CI](https://github.com/your-org/uom-football-war-room/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/uom-football-war-room/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](https://uom-war-room.vercel.app) · [Project Board](https://github.com/your-org/uom-football-war-room/projects) · [Report Bug](https://github.com/your-org/uom-football-war-room/issues)

</div>

---

## What Is This?

UOM Football War Room is a fan engagement web platform where users follow real professional clubs (Premier League, La Liga, Champions League, and more), enter **live match discussion rooms** called War Rooms, place **virtual coin predictions** before kickoff, earn **loyalty tiers**, and receive **AI-assisted pre-match insights**.

It combines real-time community interaction, gamification mechanics, real sports data, and platform governance into one cohesive system — built with the complexity of a production product, scoped to be achievable as a university portfolio project.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Pages](#pages)
- [Build Phases](#build-phases)
- [DevOps & CI/CD](#devops--cicd)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Risk Areas](#risk-areas)
- [Future Enhancements](#future-enhancements)

---

## Features

| Feature | Status |
|---|---|
| Real club and fixture data synced from football-data.org | ✅ Phase 1 |
| User authentication (credentials + optional OAuth) | ✅ Phase 1 |
| Favourite club selection | ✅ Phase 1 |
| Live War Room discussion rooms per match (Socket.IO) | ✅ Phase 2 |
| Post reporting and moderation queue | ✅ Phase 2 |
| Virtual coin wallet | ✅ Phase 3 |
| Match predictions with automated settlement | ✅ Phase 3 |
| Loyalty tier progression: New Fan → Supporter → Core Supporter → Ultras | ✅ Phase 4 |
| Club and user leaderboards | ✅ Phase 4 |
| Admin and moderation console | ✅ Phase 5 |
| AI pre-match insight (FastAPI microservice) | 🔜 Phase 6 |

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — hybrid rendering, file-based routing, server actions
- **TypeScript** — type safety across the entire codebase
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible, composable UI components

### Backend
- **Next.js API Routes** — REST endpoints within the same codebase
- **Prisma ORM** — type-safe database access and schema migrations
- **NextAuth v5** — authentication with credentials and optional OAuth
- **Socket.IO** — real-time WebSocket communication for War Rooms
- **bcryptjs** — password hashing

### Database
- **PostgreSQL 16** — relational database for all structured data
- **Supabase** — managed PostgreSQL with free tier (recommended for deployment)

### External APIs
| API | Purpose | Tier |
|---|---|---|
| [football-data.org](https://www.football-data.org) | Clubs, fixtures, results, standings | Free (10 req/min) |
| TheSportsDB | Club logos and team images | Free |
| API-Football (RapidAPI) | Fallback for detailed stats and lineups | Free (100 req/day) |

### Infrastructure
- **Vercel** — Next.js hosting + preview deployments + cron jobs
- **GitHub Actions** — CI pipeline (lint, typecheck, build)
- **Docker Compose** — local development Postgres
- **Sentry** — error tracking and performance monitoring

### AI Service (Phase 6)
- **FastAPI** (Python) — separate microservice for pre-match prediction models
- Called from Next.js API routes server-side, never from the client

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Browser / Client               │
│         React (Next.js App Router)          │
└──────────────┬──────────────────────────────┘
               │  HTTP + WebSocket
┌──────────────▼──────────────────────────────┐
│           Next.js Application               │
│  ┌─────────────┐   ┌──────────────────────┐ │
│  │  App Pages  │   │    API Routes        │ │
│  │  (React)    │   │  /api/**             │ │
│  └─────────────┘   └──────────┬───────────┘ │
│                               │             │
│  ┌────────────────────────────▼───────────┐ │
│  │           Prisma ORM Layer             │ │
│  └────────────────────────────┬───────────┘ │
│                               │             │
│  ┌────────────────────────────▼───────────┐ │
│  │        Socket.IO Server                │ │
│  │   (War Room real-time messaging)       │ │
│  └────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────┘
                                │
               ┌────────────────▼───────────────┐
               │         PostgreSQL              │
               │    (Supabase managed)           │
               └────────────────────────────────┘
```

**External data flow:**
```
football-data.org ──► Sync Service ──► PostgreSQL ──► Your API Routes
(Vercel Cron every 6 hours — users never hit the external API directly)
```

**AI flow (Phase 6):**
```
Next.js API ──► FastAPI Python Service ──► Response with probability + insight
```

### Key Architecture Decisions

**Monolith first.** The project starts as a single Next.js application. Socket.IO and the AI service are the only exceptions — Socket.IO requires a custom server, and the AI service is Python-only. Everything else stays in one codebase.

**Never call external APIs from user requests.** All club and fixture data is synced into PostgreSQL on a schedule. Users read from your database only. This eliminates rate limit errors, slow API responses, and downtime risk from third-party services.

**PostgreSQL over MongoDB.** The data is deeply relational — users link to clubs, clubs link to fixtures, fixtures link to predictions, predictions link to transactions. ACID transactions are required for coin settlement.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local Postgres)
- A [football-data.org](https://www.football-data.org/client/register) API key (free)
- A [Supabase](https://supabase.com) account (free tier is sufficient)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/uom-football-war-room.git
cd uom-football-war-room

# 2. Install dependencies
npm install

# 3. Start local Postgres
docker compose -f docker/docker-compose.yml up -d postgres

# 4. Copy environment file and fill in values
cp .env.example .env

# 5. Run migrations and seed
npx prisma migrate dev
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # Run ESLint
npx tsc --noEmit      # TypeScript check (no output)
npx prisma studio     # Open Prisma Studio (visual DB browser)
npx prisma migrate dev     # Run pending migrations
npx prisma db seed         # Seed database with test data
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/uomfootball"

# Auth
NEXTAUTH_SECRET="random-secret-min-32-chars"
NEXTAUTH_URL="https://your-domain.vercel.app"

# External APIs
FOOTBALL_DATA_API_KEY="your-key-from-football-data.org"

# App config
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# AI service (Phase 6)
AI_SERVICE_URL="https://your-fastapi-service.com"

# Sentry (added in DevOps phase)
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# Environment identifier
NODE_ENV="development"
APP_ENV="dev"           # dev | staging | production
```

Get your free football-data.org key at: https://www.football-data.org/client/register

---

## Database Schema

The database is designed around five core domains. Key relationships:

- One **User** has one **SupportProfile** (their chosen club)
- One **Club** has many **SupportProfiles** (its supporters)
- One **Fixture** has two **Clubs** (home + away)
- One **Fixture** has many **WarRoomPosts** and **Predictions**
- One **User** has many **Predictions**, **CoinTransactions**, **WarRoomPosts**, **Notifications**
- One **WarRoomPost** can have many **ModerationReports**

Full Prisma schema lives in [`prisma/schema.prisma`](prisma/schema.prisma).

### Enums at a glance

| Enum | Values |
|---|---|
| `Role` | `SUPPORTER` `MODERATOR` `ADMIN` `CLUB_REP` |
| `LoyaltyTier` | `NEW_FAN` `SUPPORTER` `CORE_SUPPORTER` `ULTRAS` |
| `FixtureStatus` | `SCHEDULED` `LIVE` `COMPLETED` `POSTPONED` `CANCELLED` |
| `PredictionType` | `WINNER` `SCORELINE` `FIRST_SCORER` |
| `PredictionStatus` | `PENDING` `WON` `LOST` `VOID` |
| `TransactionType` | `CREDIT` `DEBIT` `REWARD` `PENALTY` `REFUND` |

---

## API Reference

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/clubs` | All clubs with supporter counts |
| `GET` | `/api/clubs/[id]` | Single club + recent fixtures |
| `GET` | `/api/fixtures` | All fixtures with clubs |
| `GET` | `/api/fixtures/[id]` | Single fixture detail |
| `GET` | `/api/warroom/[fixtureId]` | All posts for a fixture |

### Authenticated (User)

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/profile/club` | Select favourite club |
| `POST` | `/api/warroom/[fixtureId]` | Post a message |
| `POST` | `/api/warroom/[postId]/report` | Report a post |
| `POST` | `/api/predictions` | Place a prediction |
| `GET` | `/api/wallet` | Coin balance + transaction history |

### Admin / Moderator

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/sync` | Admin | Trigger external API sync |
| `POST` | `/api/admin/fixtures` | Admin | Create fixture manually |
| `PATCH` | `/api/admin/fixtures/[id]` | Admin | Update result + trigger settlement |
| `GET` | `/api/admin/moderation` | Moderator | Open reports queue |
| `PATCH` | `/api/admin/moderation/[id]` | Moderator | Resolve a report |

---

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home: featured matches, top clubs, recent activity |
| `/clubs` | Public | All synced clubs grid |
| `/clubs/[id]` | Public | Club profile, supporter count, recent fixtures |
| `/fixtures` | Public | Upcoming + past matches with status |
| `/fixtures/[id]` | Public | Match detail, war room, predictions, AI insight |
| `/login` | Guest only | Login form |
| `/register` | Guest only | Registration form |
| `/profile` | User | Profile, club selection, loyalty tier, wallet |
| `/leaderboard` | Public | Club rankings, top predictors, loyal fans |
| `/admin` | Admin | Dashboard overview |
| `/admin/fixtures` | Admin | Manage fixtures and results |
| `/admin/moderation` | Moderator+ | Reports queue |
| `/admin/economy` | Admin | Coin and loyalty configuration |

---

## Build Phases

The project is structured into 6 phases, shipping value at each step.

### Phase 0 — Environment Setup *(Day 1–2)*
Working project skeleton: Next.js, Prisma, Supabase connected, all tables created.

### Phase 1 — Foundation *(Weeks 1–3)*
Auth, real club/fixture sync from football-data.org, core pages, deployed to Vercel.
> ✅ Ship goal: User can register, log in, see real clubs, view fixtures, select a favourite club.

### Phase 2 — War Room *(Weeks 4–5)*
Live match discussion via Socket.IO. Custom server, room-keyed WebSocket connections, DB-persisted posts, report system.
> ✅ Ship goal: Two browser tabs on the same match see each other's messages in real time.

### Phase 3 — Coins and Predictions *(Weeks 6–7)*
Virtual wallet, prediction placement locked before kickoff, atomic coin settlement via `prisma.$transaction()`.
> ✅ Ship goal: User places prediction, coins deducted, admin enters result, coins credited/debited with full history.

### Phase 4 — Loyalty and Leaderboards *(Week 8)*
Points per action, tier thresholds (0 / 100 / 500 / 2000), automatic tier upgrades, club + user rankings.
> ✅ Ship goal: User earns points through activity, tier updates automatically, appears on leaderboard.

### Phase 5 — Admin Panel and Moderation *(Week 9)*
Protected dashboard: fixture management, moderation queue, economy config, sync trigger, audit log.
> ✅ Ship goal: Admin manages the entire platform without touching the database directly.

### Phase 6 — AI Insights *(Week 10+)*
FastAPI Python microservice. Pre-match win probability, narrative summary, confidence indicator. Called server-side; never exposed to client.
> ✅ Ship goal: Match pages show AI-generated comparison from Python service with "Advisory only" disclaimer.

---

## Project Structure

```
uom-football-war-room/
├── .github/workflows/ci.yml          CI pipeline (lint, typecheck, build)
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── lib/
│   │   ├── db.ts                     Prisma client singleton
│   │   ├── auth.ts                   NextAuth configuration
│   │   ├── logger.ts                 Structured server-side logger
│   │   ├── sentry.ts                 Sentry init
│   │   ├── sync/
│   │   │   ├── clubs.ts              Sync clubs from API
│   │   │   └── fixtures.ts           Sync fixtures from API
│   │   └── utils/
│   │       ├── roles.ts              Role check helpers
│   │       └── coins.ts              Coin transaction helpers
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/login/ + register/
│   │   ├── clubs/
│   │   ├── fixtures/
│   │   ├── profile/
│   │   ├── leaderboard/
│   │   ├── admin/
│   │   └── api/                      All API routes
│   ├── components/
│   │   ├── layout/                   Navbar, Footer
│   │   ├── clubs/                    ClubCard, ClubGrid
│   │   ├── fixtures/                 FixtureCard, StatusBadge
│   │   ├── warroom/                  WarRoom, PostList, PostInput
│   │   ├── predictions/              PredictionForm, PredictionCard
│   │   └── ui/                       Button, Badge
│   └── types/next-auth.d.ts
├── ai-service/                       FastAPI microservice (Phase 6)
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker/docker-compose.yml         Local dev Postgres
├── Dockerfile                        Next.js production image
├── server.js                         Custom server for Socket.IO
├── vercel.json                        Cron config
├── sentry.client.config.ts
├── sentry.server.config.ts
└── .env.example
```

---

## DevOps & CI/CD

### Branch Strategy

```
main       ← production only. Protected. No direct pushes.
  └── dev  ← integration branch. Staging deploys here.
        ├── feature/war-room-typing-indicator
        ├── feature/prediction-settlement
        ├── fix/coin-balance-race-condition
        └── chore/upgrade-prisma
```

- `main` requires passing CI + reviewer approval before merge
- All feature branches target `dev` via pull request
- Branch naming convention: `feature/`, `fix/`, `chore/`, `hotfix/`

### CI Pipeline (GitHub Actions)

Every PR and push to `main`/`dev` runs:

1. `npm ci` — reproducible install
2. `npx prisma generate` — required for Prisma types
3. `npm run lint` — ESLint
4. `npx tsc --noEmit` — TypeScript check
5. `npm run build` — full Next.js production build

**CI fails → PR is blocked. Fix and re-push.**

### Full Dev-to-Production Flow

```
1. Write code on feature branch
2. git push → open PR targeting dev
3. GitHub Actions CI runs automatically
4. CI passes → code review → merge to dev
5. Vercel auto-deploys to staging preview URL
6. Smoke test on staging
7. Open PR: dev → main
8. CI re-runs → merge → Vercel deploys to production
9. Sentry source maps uploaded automatically
10. Cron jobs resume on new deployment
```

### Environment Strategy

| Environment | Trigger | Database |
|---|---|---|
| `dev` (local) | `npm run dev` on localhost | Local Docker Postgres |
| `staging` | Push to `dev` branch | Supabase staging project |
| `production` | Push to `main` branch | Supabase production project |

---

## Deployment

### Services

| Service | Purpose | Cost |
|---|---|---|
| Vercel | Next.js hosting + cron jobs | Free hobby tier |
| Supabase | PostgreSQL database | Free tier (500MB) |
| football-data.org | Club + fixture data | Free (10 req/min) |
| TheSportsDB | Club logos | Free |

### Steps

1. Push repo to GitHub
2. Create Supabase project → copy connection string
3. Connect GitHub repo to Vercel
4. Add all environment variables in Vercel dashboard (separately per environment)
5. Add `vercel.json` for cron schedule:

```json
{
  "crons": [
    { "path": "/api/admin/sync", "schedule": "0 */6 * * *" }
  ]
}
```

6. Vercel auto-deploys on every push to `main`
7. Run initial club sync from admin panel after first deploy
8. Verify cron is active: Vercel dashboard → Cron Jobs tab

### Docker (Optional — for self-hosting or local prod testing)

```bash
# Local Postgres only
docker compose -f docker/docker-compose.yml up -d postgres

# Full stack including AI service (Phase 6)
docker compose -f docker/docker-compose.yml up -d
```

> The Next.js app deploys to Vercel in production — Docker is only needed for local development parity and the AI microservice.

---

## Monitoring

### Sentry — Error Tracking

Sentry captures unhandled exceptions from both the Next.js frontend and server-side API routes.

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

- Disabled in `dev` to keep local development clean
- `tracesSampleRate: 0.2` in production (20% of transactions)
- `environment` tag enables filtering by `dev` / `staging` / `production`
- Source maps uploaded automatically during Vercel build

### Structured Logging

`src/lib/logger.ts` provides JSON-structured logging across all API routes:

```typescript
logger.info("Club sync started", { competition: "PL" });
logger.error("Fixture sync failed", { error: err.message });
logger.debug("Only visible in dev", { data });  // suppressed in production
```

Vercel captures all `console.*` output and displays it in the Functions Logs tab per deployment.

---

## Risk Areas

| Risk | Impact | Mitigation |
|---|---|---|
| External API rate limits | Fixtures fail to sync | Cache in DB, sync on schedule not per request |
| Coin settlement bugs | Users gain/lose coins unfairly | Use `prisma.$transaction()`, test with seed data |
| Socket.IO scaling | War room breaks under load | Single server MVP; Redis adapter if needed later |
| Toxic content in war rooms | Community harm | Report system, moderation queue, slow mode, room locking |
| AI output misleading | Users misled by predictions | Confidence indicator + "Advisory only" disclaimer |
| Scope creep | Project never ships | Ship MVP phases 1–3 first; features only after |

---

## Future Enhancements

After MVP is live and stable:

- Native mobile app (React Native / Expo)
- Fantasy points system with seasonal tournaments
- Club-vs-club seasonal rivalry campaigns
- Live match event feed (goals, cards, substitutions)
- Voice rooms for match-day audio commentary
- Push notifications for match start and results
- Advanced AI: tactical simulation, sentiment analysis, upset detection
- Sponsor integrations and official club verification

---

## User Roles

| Role | Permissions |
|---|---|
| **Guest** | Browse matches, clubs, and public leaderboards |
| **Supporter** | Join war rooms, place predictions, earn loyalty |
| **Moderator** | Review reports, apply moderation actions |
| **Admin** | Full platform control — fixtures, clubs, economy, users |

---

## Contributing

1. Fork the repo and create your branch from `dev`
2. Follow the branch naming convention: `feature/`, `fix/`, `chore/`
3. Ensure `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass locally
4. Open a pull request targeting `dev` — never directly to `main`
5. Fill in the PR template checklist before requesting review

---

## License

MIT © University of Moratuwa — UOM Football War Room

---

<div align="center">

Built with **Next.js** · **PostgreSQL** · **Prisma** · **Socket.IO** · **football-data.org** · **GitHub Actions** · **Sentry**

</div>