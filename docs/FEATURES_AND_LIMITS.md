# Included features and current limits

This is a complete source/deployment package for ONYX Render edition 1.1.0. It is not a claim that every item in the original extended 103-section brief is finished.

## Included

- Editorial responsive public website: home, about, artists, portfolio, styles, services, pricing, booking/custom consultation, studio, hygiene, aftercare, testimonials, FAQs, journal, gallery, offers, flash, contact and policy pages, plus supported content detail pages.
- Dark/bone design, optional light theme, hover treatments, viewport reveals, moving text, reading progress, desktop cursor, mobile menu, reduced-motion styles and before/after image comparison when supplied.
- Five-stage consultation request, age/consent validation, private reference image uploads, preferred availability, booking ID, private booking-tracking code and tentative calendar export.
- Admin overview, booking status/artist/duration/notes, scheduling conflicts and working hours/holidays, day/week/month calendar, customer records/notes, contact inbox and audit history.
- Content CRUD, draft/published/archive state, ordering, plain-text preview, demo labeling, image/alt text, SEO fields, studio settings and basic pricing values.
- Native email/password staff sign-in, scrypt password hashes, server-side hashed sessions, password change, owner recovery command, role checks and signed guest upload ownership.
- SQLite transactional persistence and filesystem image storage on one Render persistent disk. Automatic idempotent startup migrations; database/upload backup and checksum-checked restore scripts.
- Basic request counters, origin checks for writes, HTTP security headers, safe CSV export, health endpoint, dynamic metadata/sitemap, local font packages and locked dependencies.
- Customer access codes scope tracking to a single booking; customer responses omit private studio notes. No dependency on ChatGPT or Cloudflare authentication.

## Not connected or not implemented

- Payment gateways, automatic collection/refunds, invoices or full transaction accounting. Current entries record amounts manually.
- Outbound email, SMS, WhatsApp messages and automatic reminders. Queued intents are marked `not_configured`, never delivered.
- Customer registration/password recovery, customer-written review moderation or automatic lost-booking-code recovery.
- Embedded live Instagram/Google feeds or external calendar synchronization. Linkouts and downloadable tentative calendar entries are different features.
- Video/document upload, transcoding, automatic image compression, bulk media replacement/reordering.
- WebGL/body-map features, full drag-and-drop calendar, granular role editor, full pricing-surcharge engine, rich-text/page builder, immutable content version restoration, exclusive flash reservations, PWA and automated offsite backups.
- Multi-instance deployment, zero-downtime disk-backed deployment or high-volume architecture. Move data/uploads to appropriate shared services before scaling this design horizontally.
- Full browser/component/accessibility acceptance testing, load tests, Lighthouse/Core Web Vitals certification or a comprehensive independent security audit.

## Operational boundaries

Demo artist identities, examples and stock images are illustrative, not representations of verified ONYX work. Demo photos depend on external Unsplash/Pexels CDNs until you replace them. Hero/banner layout and some image mappings remain source-level settings. Fonts are packaged through local dependencies.

Before public commercial use, enter genuine business details, replace demo content, approve policies/aftercare information, test your actual Render deployment and arrange customer communications and backups. Rate counters are intentionally simple hourly controls; the application does not include a full abuse-prevention service.

The delivery contains no exported live database, private uploads, existing passwords, user sessions or third-party API credentials. It starts a new independent deployment. Integrations listed above are not activated by adding an API key alone; implementation and validation are still needed.
