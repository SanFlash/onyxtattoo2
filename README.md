# onyxtattoo2

> **Render Free deployment:** This repository is configured for the Render Free service. See [docs/FREE_RENDER.md](docs/FREE_RENDER.md) before deploying. Free Render has an ephemeral filesystem, so the current SQLite database and uploaded media are not durable. The older paid-disk instructions later in this README are retained for paid deployments.

=======
# ONYX Tattoo Studio — Render edition

Start with [START_HERE.md](START_HERE.md), or open [RENDER_GUIDE.html](RENDER_GUIDE.html) in a browser.

A React / Next.js / TypeScript website with a native Node.js backend, admin panel, SQLite database, image uploads and role-based staff access. Normal email/password login replaces the original hosting-specific identity integration. Both website and admin deploy together.

## Documentation

- [Complete Render deployment guide](docs/RENDER_DEPLOYMENT.md)
- [Features and limitations](docs/FEATURES_AND_LIMITS.md)
- [Admin operating guide](docs/ADMIN_GUIDE.md)
- [Validation results](docs/VALIDATION.md)
- [Image and font credits](docs/CREDITS.md)

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact locked dependencies |
| `npm run setup` | Create private local configuration without overwriting existing `.env` |
| `npm run dev` | Migrate, create initial owner if needed, start local development |
| `npm run build` | Build production website and server |
| `npm start` | Migrate, create initial owner if needed, run production server |
| `npm run check` | TypeScript validation |
| `npm test` | Isolated validation/storage/authentication tests |
| `npm run test:e2e` | Test built production server with temporary data; run build first |
| `npm run backup -- /absolute/new-backup-folder` | Consistent database snapshot plus uploaded images |
| `npm run restore -- /backup-folder /new-data-folder` | Validate and restore a complete backup into a new directory |
| `npm run admin:reset` | Interactive owner-password recovery; uses `ADMIN_EMAIL` |

## Source map

- `app/`: pages, API handlers, sign-in, authentication, metadata and styles.
- `components/onyx/`: website, booking form and administration UI.
- `lib/`: data definitions, validation, native SQLite/files and password/token utilities.
- `migrations/`: ordered, checksum-protected database migrations.
- `scripts/`: setup, start, migration, owner recovery and backup/restore commands.
- `public/`: static assets. Fonts are served from installed font packages at build time.
- `tests/`: isolated tests; no production credentials or data needed.
- `render.yaml`: paid Render Blueprint for this application.

Runtime: Node.js 24.19.0. One process/service with SQLite on a persistent disk. Data is not stored in the Git repository. No secrets are shipped; `.env.example` is a blank template. Never edit an applied migration: add a new numbered SQL migration.

