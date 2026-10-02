# ONYX on Render Free

This release supports running ONYX on a Render Free web service without a persistent disk.

## What changed

- The Render service plan is Free.
- The persistent /var/data disk requirement was removed.
- The application uses DATA_DIR=.data on the Free service.
- SQLite migrations and the initial administrator still run during startup.
- APP_URL may use Render's automatic RENDER_EXTERNAL_URL.
- SESSION_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD remain required.

## Important storage limitation

Render Free web services have an ephemeral filesystem. Local SQLite files and uploaded media can be lost when the service redeploys, restarts, or spins down after inactivity.

Therefore this Free configuration is suitable for:
- visual/demo deployments
- testing the complete ONYX UI
- portfolio demonstrations
- development and QA
- short-lived pilot use

It is not a durable production-data configuration for real customer bookings, customer records, or permanent media.

For durable production data, move the database and media storage to external persistent services before launch.

## Render settings

- Runtime: Node
- Plan: Free
- Build: npm ci --include=dev && npm run build
- Start: npm start
- Health check: /api/health
- DATA_DIR=.data
- Node: 24.19.0

Do not add a Render persistent disk to a Free service.

## Required environment variables

- SESSION_SECRET — at least 32 random characters
- ADMIN_EMAIL — initial studio administrator email
- ADMIN_PASSWORD — 12–128 character initial administrator password
- ADMIN_NAME — optional; defaults to Studio Owner

APP_URL is optional on the default Render hostname because the application can use RENDER_EXTERNAL_URL.

## Before using real customer data

Do not treat the local SQLite database or uploaded media as durable on Render Free. If the studio needs permanent bookings, users, settings, audit history, or photographs, migrate those data paths to persistent external storage.
