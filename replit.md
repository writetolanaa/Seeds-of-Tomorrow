# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Artifacts

### `artifacts/sdg-game` (`@workspace/sdg-game`)

A top-down RPG browser game about the UN SDGs (Sustainable Development Goals). Players pick a warden character, walk a 3200×4600px world, talk to NPCs, and complete mini-games to heal 10 zones across 2 levels.

- **Style**: Sevenbooom/boombim clay-toy aesthetic — rounded-square heads, large rosy cheeks, tiny dark oval eyes, compact stub arms, separate pantsColor prop, muted realistic clothing colors
- **Character system**: `ChibiCharacter` in Sprites.tsx; `pantsColor` prop separates top from bottom; blush filter always on; happy expression has no brows (boombim style)
- **Level 1 – People** (SDGs 1–5): Baloo/Poverty, Pebblepuff/Hunger, Leaflet/Health, Thinklet/Education, Sparkleflame/Equality
- **Level 2 – Planet** (SDGs 6,12,13,14,15): Aqua/Water, Coralina/Ocean, Ferra/Forest, Gaia/Climate, Reevo/Consumption
- **Level 3 – Prosperity** (SDGs 7-11): Voltra/Energy, Gilda/Industry, Nexus/Innovation, Mira/Communities, Skylar/Cities — futuristic city biome (y=4920-7200)
- **Level 4 – Peace Space** (SDG 16): Justia — indigo space biome with aurora/stars (y=7400-9100)
- **Level 5 – Partnership Space** (SDG 17): Accord — deep cosmic biome with nebulas/galaxies (y=9300-11000)
- **Gates**: Teal arch (y=3100, Planet), Gold arch (y=4640, Prosperity), Indigo arch (y=7200, Peace), Purple arch (y=9100, Partnership) — each gate locks NPCs until previous level is complete
- **Dev unlock flag**: `DEV_UNLOCK_ALL = true` in GameContext.tsx — set `false` for release
- **Education quiz**: GeneralKnowledgeQuiz shows an intro screen first ("Let's reform the exam system!") before starting
- **Mini-games**: 17 unique puzzle types across all SDGs:
  - People: PovertyPuzzle, HungerHub, HealthPuzzle, EducationPuzzle, EqualityPuzzle
  - Planet: WaterPuzzle, OceanPuzzle (OceanDiverRPG), ForestPuzzle, ClimatePuzzle, ConsumptionPuzzle
  - Prosperity: EnergyPuzzle (match clean energy to cities), IndustryPuzzle (worker-job matching), InnovationPuzzle (budget allocation), CommunitiesPuzzle (resource sliders), CitiesPuzzle (sustainable choice quiz)
  - Peace: JusticeQuestPuzzle (judge 5 court cases, need 4/5 correct)
  - Partnership: GlobalLinkPuzzle (memory-match nations to partnership projects)
- **Tech**: React + Vite + Framer Motion + canvas-confetti, no backend needed
- **State**: localStorage-persisted game progress (`sdg_game_save_v3`)
- **Pages**: TitleScreen, GameWorld (main walk-around), PuzzleScreen, OceanDiverRPG
- **Key files**: `src/pages/GameWorld.tsx`, `src/pages/PuzzleScreen.tsx`, `src/components/Sprites.tsx`, `src/data/worldMap.ts`, `src/data/gameData.ts`, `src/context/GameContext.tsx`
- **World constants**: WORLD_W=3200, WORLD_H=11000, PLAYER_SPAWN=(1580,1200), PLAYER_SPEED=5, INTERACT_RADIUS=100
- **HUD**: Progress bars (People 0-5, Planet 0-5) + overall World Healing % + map toggle button (top-right, shows full 5-level minimap)

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
