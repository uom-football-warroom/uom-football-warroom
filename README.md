<div align="center">

# ⚽ UOM Football War Room

**Real-time football fan engagement platform — production-grade full-stack portfolio project**

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

UOM Football War Room is a fan engagement platform where supporters follow real professional clubs, join **live match discussion rooms**, place **virtual coin predictions**, earn **loyalty tiers**, and receive **AI-assisted pre-match insights** — all backed by live data from football-data.org.

---

## Features

- 🏟️ Real club and fixture data synced from football-data.org (PL, La Liga, CL, and more)
- 💬 Live War Room chat per match — real-time via Socket.IO
- 🪙 Virtual coin wallet with match prediction and automated settlement
- 🏆 Loyalty tier progression: New Fan → Supporter → Core Supporter → Ultras
- 📊 Club and user leaderboards
- 🛡️ Full moderation and admin console
- 🤖 AI pre-match insights via FastAPI microservice *(Phase 6)*

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, Prisma ORM, NextAuth v5, Socket.IO, bcryptjs |
| **Database** | PostgreSQL 16, Supabase (managed) |
| **Infrastructure** | Vercel, GitHub Actions, Docker Compose, Sentry |
| **AI Service** | FastAPI (Python) — Phase 6 |

---

## Quick Start

```bash
git clone https://github.com/your-org/uom-football-war-room.git
cd uom-football-war-room
npm install

# Start local Postgres
docker compose -f docker/docker-compose.yml up -d postgres

# Configure environment
cp .env.example .env   # then fill in values

# Migrate, seed, and run
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> For full setup instructions, see [docs/DEVELOPER.md](docs/DEVELOPER.md).

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/uomfootball"
NEXTAUTH_SECRET="random-secret-min-32-chars"
NEXTAUTH_URL="https://your-domain.vercel.app"
FOOTBALL_DATA_API_KEY="your-api-key"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
APP_ENV="dev"   # dev | staging | production
```

> Full variable reference in [docs/DEVELOPER.md](docs/DEVELOPER.md).

---

## Architecture

```
Browser (React / Next.js)
        │ HTTP + WebSocket
Next.js App  ──►  Prisma ORM  ──►  PostgreSQL (Supabase)
        │
   Socket.IO Server (War Rooms)

football-data.org  ──►  Sync Service (Cron/6h)  ──►  PostgreSQL
Next.js API  ──►  FastAPI AI Service  (Phase 6)
```

All external sports data is pre-synced into PostgreSQL on a schedule — users never hit third-party APIs directly. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

---

## Documentation

| Document | Description |
|---|---|
| [docs/DEVELOPER.md](docs/DEVELOPER.md) | Local setup, Prisma workflow, project structure, dev commands |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, architecture decisions |
| [docs/API.md](docs/API.md) | All API endpoints — public, authenticated, admin |
| [docs/DEVOPS.md](docs/DEVOPS.md) | CI/CD, branching, deployment, monitoring, cron jobs |

---

## User Roles

| Role | Permissions |
|---|---|
| **Guest** | Browse matches, clubs, and public leaderboards |
| **Supporter** | Join war rooms, place predictions, earn loyalty |
| **Moderator** | Review reports, apply moderation actions |
| **Admin** | Full platform control — fixtures, clubs, economy, users |

---

## Roadmap

After MVP (Phases 1–5):

- React Native mobile app
- Fantasy points system and seasonal tournaments
- Live match event feed (goals, cards, substitutions)
- Voice rooms for match-day commentary
- Push notifications
- Advanced AI: upset detection, tactical simulation, sentiment analysis

---

## Contributing

1. Branch from `dev` using the convention: `feature/`, `fix/`, `chore/`
2. Ensure `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass locally
3. Open a pull request targeting `dev` — never `main`
4. Complete the PR template checklist before requesting review

See [docs/DEVOPS.md](docs/DEVOPS.md) for the full branching and CI/CD workflow.

---

## License

MIT © University of Moratuwa — UOM Football War Room
