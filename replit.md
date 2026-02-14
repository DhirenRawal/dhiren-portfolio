# Replit Agent Configuration

## Overview

This is a personal portfolio website for a Quantitative Finance professional (Dhiren Rawal). It's styled as a dark fintech/terminal-themed site with a market ticker, animated page transitions, and sections for experience, projects, education, skills, and a contact form. The app is a full-stack TypeScript application with a React frontend and Express backend, backed by PostgreSQL via Drizzle ORM. The database is seeded with portfolio content (resume data) on first run.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with pages: Home, Experience, Projects, Contact, and a 404 page
- **State/Data Fetching**: TanStack React Query for server state management. Custom hooks in `client/src/hooks/use-portfolio.ts` wrap all API calls
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, stored in `client/src/components/ui/`
- **Styling**: Tailwind CSS with CSS custom properties for theming. Dark fintech theme with neon green (profit) and cyan (tech) accent colors. Fonts: Inter, DM Sans, JetBrains Mono
- **Animations**: Framer Motion for page transitions and scroll-triggered reveals via `AnimatePresence`
- **Icons**: Lucide React
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via tsx)
- **API Design**: RESTful JSON API under `/api/` prefix. Route contracts defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Endpoints**:
  - `GET /api/profile` - Personal info
  - `GET /api/experience` - Work experience list
  - `GET /api/education` - Education list
  - `GET /api/projects` - Projects list
  - `GET /api/skills` - Skills list
  - `GET /api/market-data` - Market ticker data
  - `POST /api/contact` - Submit contact form message
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation. This abstraction makes swapping storage backends straightforward
- **Database Seeding**: On first run, `seedDatabase()` in `server/routes.ts` checks if data exists and populates all tables with resume content

### Shared Code
- **`shared/schema.ts`**: Drizzle ORM table definitions (PostgreSQL dialect) and Zod insert schemas via `drizzle-zod`. Tables: `personal_info`, `experiences`, `education`, `projects`, `skills`, `market_data`, `contact_messages`
- **`shared/routes.ts`**: API route contracts with method, path, and Zod response schemas. Used by both client hooks and server handlers for type consistency

### Build System
- **Development**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` runs `script/build.ts` which builds the client with Vite and bundles the server with esbuild. Output goes to `dist/` (server) and `dist/public/` (client static files)
- **Database Migrations**: `npm run db:push` uses drizzle-kit to push schema changes directly to the database

### Development vs Production
- In development, Vite dev server runs as Express middleware (`server/vite.ts`) providing HMR
- In production, Express serves pre-built static files from `dist/public/` (`server/static.ts`) with SPA fallback to `index.html`

## External Dependencies

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable (required)
- **ORM**: Drizzle ORM with `drizzle-orm/node-postgres` driver
- **Connection**: `pg.Pool` in `server/db.ts`
- **Session Store**: `connect-pg-simple` available for session management

### Key npm Packages
- `express` v5 - HTTP server
- `drizzle-orm` + `drizzle-zod` + `drizzle-kit` - Database ORM, schema validation, and migrations
- `@tanstack/react-query` - Client-side data fetching and caching
- `framer-motion` - Animation library
- `wouter` - Client-side routing
- `zod` - Schema validation (shared between client and server)
- `react-hook-form` + `@hookform/resolvers` - Form handling with Zod validation
- Full shadcn/ui component library with Radix UI primitives
- `recharts` - Charting library (available via chart component)

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal` - Runtime error overlay
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` - Dev-only Replit integrations