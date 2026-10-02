# ONYX — website + admin panel for Render

This ZIP contains the complete source package for the included ONYX release: public website, admin panel, backend, database migrations, persistent image storage, tests and deployment instructions. The website and admin run together in **one Render web service**.

**Open `RENDER_GUIDE.html` in your browser for the full step-by-step guide.** The same guide is in `docs/RENDER_DEPLOYMENT.md`.

## Fast route

1. Extract the ZIP. Open the `onyx-render` folder.
2. Create a private GitHub repository and upload this folder's **contents**. `package.json` and `render.yaml` must appear at the repository root. Do not upload only the ZIP.
3. In Render, choose **New → Blueprint**, connect that repository, select `main`, and use `render.yaml`.
4. Enter your `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of 12–128 characters. Save them in a password manager. Render generates `SESSION_SECRET`.
5. Review the paid **Standard web service + 5 GB persistent disk** configuration and create the service. Persistent storage is essential; this package is not suitable for a free/static service.
6. Wait for the deploy to become live. Website: your Render URL. Admin: that URL plus `/admin`. Sign in with the credentials from step 4.
7. Click **LOAD DEMO CONTENT**, update Settings, replace demo artists/photos, and make a test booking before accepting customers.

Build command: `npm ci --include=dev && npm run build`

Start command: `npm start`

Health path: `/api/health`

Disk mount: `/var/data` · `DATA_DIR=/var/data/onyx`

No separate frontend deployment, PostgreSQL, Cloudflare, ChatGPT sign-in or external auth provider is required.

## Read before launch

- Payments are manual records; no money is collected by the app. Outbound email/SMS/WhatsApp delivery and reminders are not connected.
- Customers receive a private booking code on screen. There is no automatic confirmation email or customer registration system.
- Demo photographs currently load from external stock-photo CDNs. Upload your own images through the admin panel before your commercial launch.
- This ZIP contains source and demo content, not a copy of your existing live database or private customer files.
- Included code is a working release, not every optional feature from the original extended brief. See `docs/FEATURES_AND_LIMITS.md`.
- Build, local production HTTP tests, database persistence and backup/restore were checked. Your own Render deployment and browser/device acceptance checks are still required; see `docs/VALIDATION.md`.

For local testing, install Node.js **24.19.0**, open a terminal in this folder and run:

```sh
npm ci
npm run setup
npm run dev
```

The setup command asks for your email and prints a generated local admin password. Open `http://localhost:3000/admin`.
