# Validation — Render edition 1.1.0

Checked 2 October 2026 in an isolated local Node.js 24.19.0 environment.

| Check | Result |
| --- | --- |
| Locked dependency installation | Passed |
| `npm run build` | Passed; Next.js production build and route generation |
| `npm run check` | Passed; TypeScript |
| `npm test` | 15 tests passed, 0 failed |
| `npm run test:e2e` | 109 HTTP/assertion checks passed |
| Backup and restore | Snapshot and uploaded image bytes verified; restored data used for a subsequent production-server start |
| Package/deployment consistency | Dependency declarations match lockfile; expected disk/start settings present |

The production HTTP suite covers public routes, admin redirects, native password login, origin rejection, spoofed identity-header rejection, private uploads and file-type rejection, demo initialization, booking submission, per-booking access-code isolation, customer display data and omission of internal notes, atomic scheduling-conflict rollback, occupied availability, cancellation and reassignment, contact persistence, content and image use, viewer permission restrictions, account disabling, password change/logout, sensitive-field omission, backup/restore and restart persistence.

The tests use synthetic identities and temporary data. They do not modify the existing live Site, and they do not send messages or collect payments. The suite starts the real production Node server; it is not a browser UI automation suite.

## Remaining environment-specific acceptance

- No service was provisioned in your Render account. Confirm the disk, secrets, DNS, HTTPS, health, sign-in and persistence on your deployment using section 8 of the guide.
- Browser interaction, mobile/desktop visual acceptance, keyboard/screen-reader review, outbound stock-CDN image availability and measured performance were not certified in this validation.
- No payment, email, SMS or WhatsApp provider integration is included or tested.
- The backup/restore test demonstrates this application's snapshot workflow with isolated data. Your offsite transfer, retention policy and recovery environment still need an operational check.
- The YAML was parsed and its expected values checked locally; no authenticated Render Blueprint validation or deployment was performed.

The checks support the tested release behavior. They are not a guarantee of zero deployment errors, unlimited traffic or compliance with every item in an earlier expanded specification.
