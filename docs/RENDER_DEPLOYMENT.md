# ONYX: complete Render deployment guide

Website + admin panel · Render edition 1.1.0 · 2 October 2026

Follow the sections in order. You will deploy one Node web service containing the website, admin panel and API. Its persistent disk stores the database and uploaded images. A separate database account is not required.

## 1. What you need

- This ZIP, extracted on your computer.
- A GitHub account and a Render account that can create a paid service.
- An administrator email address and a unique password, 12–128 characters long.
- A password manager for your admin credentials and server secrets.
- Optional for local testing: Node.js 24.19.0, npm and Git. Get Node from https://nodejs.org/ and Git from https://git-scm.com/.

The supplied Blueprint selects **Standard**, Singapore, and a **5 GB persistent disk**. Review Render's displayed charges before creating it. A free web service cannot provide the persistent disk this application requires. This is a dynamic web service, not a Static Site.

Only the contents of `/var/data` survive deployment changes in this configuration. Keep `DATA_DIR=/var/data/onyx`. A disk-backed service uses one instance and has a brief interruption during redeployment; this setup does not promise zero downtime or horizontal scaling.

## 2. Extract and identify the correct folder

1. Download `ONYX_Studio_Render_Complete.zip`.
2. Extract it using your computer's normal ZIP utility.
3. Open the extracted `onyx-render` folder.
4. Confirm you see `package.json`, `package-lock.json`, `render.yaml`, `app`, `components`, `lib`, `migrations`, `scripts` and `docs`.
5. Keep `.env.example`, `.node-version` and `.gitignore`; some file managers hide dotfiles.

The ZIP intentionally excludes installed dependencies, generated build output, private credentials and runtime customer data. `npm ci` installs dependencies and `npm run build` produces the server during deployment.

## 3. Optional: run it on your own computer first

Open a terminal inside `onyx-render`. On Windows, open the folder, click its address bar, type `powershell` and press Enter. On macOS/Linux, open Terminal and `cd` to the extracted folder.

```sh
node --version
npm --version
npm ci
npm run setup
npm run dev
```

`node --version` should show `v24.19.0`. Setup asks for your admin email, creates `.env` and prints a generated local password. Save that password. The script does not overwrite an existing `.env`.

Open:

- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Health check: `http://localhost:3000/api/health`

Use the exact `localhost` URL shown above; local configuration checks request origins. Do not substitute `127.0.0.1` unless you also change `APP_URL`.

To test the production build, stop the development server with Ctrl+C, then run:

```sh
npm run build
npm start
```

Optional automated checks:

```sh
npm run check
npm test
npm run test:e2e
```

The HTTP suite runs a separate local production server on a temporary port with temporary data, then removes that test data. It requires a completed production build. It never targets your live Render application.

Local `.data` is separate from Render. Running locally does not populate your Render service. Do not commit `.env`, `.data`, `node_modules`, `.next`, backups or customer files.

## 4. Put the source in GitHub

### Recommended: Git or GitHub Desktop

1. Create a **private** empty repository on GitHub, for example `onyx-tattoo-studio`. Do not initialize it with another README.
2. In a terminal opened inside the extracted `onyx-render` folder, run the following. Replace `YOUR-USERNAME` with your real GitHub username.

```sh
git init
git add .
git status
git commit -m "Add ONYX Render website and admin"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/onyx-tattoo-studio.git
git push -u origin main
```

If Git asks for your author name/email, configure them using your own details and repeat the commit. Authenticate to GitHub using its supported sign-in/token flow. Do not put passwords or tokens into these source files.

3. Open the repository on GitHub. You should see `render.yaml` and `package.json` directly at the top level.
4. Check `.env` and `.data` are absent. The provided `.gitignore` excludes them.

GitHub Desktop is also suitable: add the extracted folder as a local repository, commit it and publish it privately.

### Alternative: GitHub website upload

Create a new repository, then use **Add file → Upload files**. Upload all source folders/files from **inside** `onyx-render`, including `package-lock.json`, `render.yaml`, `.gitignore` and `.node-version`. Commit the upload. Verify the same root layout. Do not upload the ZIP itself as the application's source. Git/GitHub Desktop is less error-prone for folders and hidden files.

If you accidentally uploaded a nested `onyx-render` folder, move its contents to the repository root before following the Blueprint route. For the manual route below you can instead set Root Directory to `onyx-render`.

## 5. Deploy using the included Render Blueprint

1. Sign in at https://dashboard.render.com/.
2. Choose **New → Blueprint** (the dashboard may label this Blueprints/New Blueprint).
3. Connect your GitHub account and allow Render to read the new repository.
4. Select the repository and branch `main`.
5. Use the default Blueprint file, `render.yaml` at repository root.
6. Review the generated service: Node web service, Standard plan, Singapore, one 5 GB disk mounted at `/var/data`.
7. Fill the prompted secrets:
   - `ADMIN_EMAIL`: your administrator's email, without surrounding spaces.
   - `ADMIN_PASSWORD`: a unique password of 12–128 characters. Use a password manager; do not use a demonstration password.
8. Render generates `SESSION_SECRET` from `generateValue: true`. Keep its value stable across deployments.
9. Review charges and choose the create/apply/deploy action.
10. Wait until the service is marked live. Follow the logs if it is still building.

The Blueprint configures:

| Setting | Exact value |
| --- | --- |
| Runtime | Node |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Node version | `24.19.0` |
| Health check | `/api/health` |
| Persistent disk mount | `/var/data` |
| App data directory | `/var/data/onyx` |
| Instance count | One |

Leave the pre-deploy command empty. Migrations run in the start script, where the disk is available. Build-time or pre-deploy migration commands cannot access this persistent disk.

You do not need to set `PORT`; the server uses Render's value and listens on `0.0.0.0`. You do not need to enter `APP_URL` for the initial Render address; the app reads `RENDER_EXTERNAL_URL` automatically.

Typical successful logs include the Next.js production build, `Initial studio administrator created.` on the first start, and `Studio storage and authentication are ready.` on each start.

## 6. Manual web-service setup, if you do not use Blueprints

Use this section **instead of** section 5. Do not create two competing services.

1. Render → **New → Web Service** → connect the GitHub repository.
2. Choose a service name and the `main` branch.
3. Set Language/Runtime to **Node**, region Singapore, and a paid **Standard** instance.
4. Leave Root Directory empty when `package.json` is at repository root.
5. Set build command to `npm ci --include=dev && npm run build`.
6. Set start command to `npm start`.
7. Add the environment variables in the table below.
8. In Advanced/Disk settings, add a 5 GB disk named `onyx-data`, mounted at `/var/data`, **before starting the service**.
9. Set health check path to `/api/health`. Leave pre-deploy command empty.
10. Create the web service and wait for it to become live.

| Variable | Required value or meaning |
| --- | --- |
| `NODE_VERSION` | `24.19.0` |
| `NODE_ENV` | `production` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATA_DIR` | `/var/data/onyx` |
| `SESSION_SECRET` | At least 32 random characters; use Render's Generate option or the command below |
| `ADMIN_EMAIL` | Your real owner email; used for initial creation and password-recovery command |
| `ADMIN_PASSWORD` | Unique 12–128 character password for the first admin creation |
| `ADMIN_NAME` | Optional display name, such as `Studio Owner` |
| `APP_URL` | Optional initially; exact HTTPS origin for your custom domain later |

To generate a strong secret on a computer with Node installed:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Paste the output only into `SESSION_SECRET` in Render's environment settings. Do not add it to GitHub. Never prefix secrets with `NEXT_PUBLIC_`.

## 7. Open the website and sign in to admin

Suppose Render gives you `https://YOUR-SERVICE.onrender.com`:

| Area | Address |
| --- | --- |
| Website | `https://YOUR-SERVICE.onrender.com/` |
| Admin panel | `https://YOUR-SERVICE.onrender.com/admin` |
| Login | `https://YOUR-SERVICE.onrender.com/login` |
| Booking form | `https://YOUR-SERVICE.onrender.com/booking` |
| Customer booking tracking | `https://YOUR-SERVICE.onrender.com/account` |
| Health | `https://YOUR-SERVICE.onrender.com/api/health` |

1. Open `/api/health`. Expect `{"status":"ok"}`.
2. Open `/admin`; it redirects to login.
3. Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured at creation. There is no preset shared password.
4. On Overview, click **LOAD DEMO CONTENT** once. This copies the demonstration collection into editable storage. The public site shows fallback demo content even before initialization.
5. Update Settings with verified studio information and contact details.
6. Replace demo artists, portfolio photographs, policies, prices and copy. See `docs/ADMIN_GUIDE.md`.
7. Use the password-change link in the admin footer, or visit `/password`, to set your preferred password.

**Changing `ADMIN_PASSWORD` in Render later does not reset an existing account.** Bootstrap creates an owner only when none exists. It deliberately preserves the current password and data during every redeploy. You can remove `ADMIN_PASSWORD` from the service environment after confirming the owner account works; retain `ADMIN_EMAIL` for recovery and keep your credentials in your password manager.

## 8. Verify the real deployment before using it

1. In an incognito browser, browse the homepage, portfolio, artist pages and booking form.
2. Submit a test booking for a future working day. Upload one test PNG/JPEG/WebP reference.
3. Save the booking ID **and private access code/link** shown on confirmation. The code is the customer's credential; it is not emailed automatically.
4. In admin Bookings, open that booking and verify its fields and private reference image.
5. Assign an artist, pick the time/duration and mark it Confirmed. Pending requests do not reserve times.
6. Submit a second test request for the same artist/time. Confirming it should show a conflict until you select another time or cancel the first session.
7. Check `/account` using the first private code. Request a cancellation/reschedule and verify the admin notification. The request needs staff action; it does not itself cancel a confirmed slot.
8. Submit the contact form and verify Enquiries.
9. Upload a public image under Media library, use it in portfolio content and open its public page.
10. Create a test VIEWER account and verify it cannot change bookings or access user management.
11. In Render, restart or redeploy the same service. Verify the booking and image are still present. This confirms your disk is attached correctly.
12. Check the menu, form steps, errors, keyboard navigation and content on a real phone and desktop browser. Mark test bookings Cancelled when finished.

Do not enter real customer information until these checks pass and your content is approved. A passing health check proves the service/database are available, not that every browser workflow has been accepted.

## 9. Add your own domain

1. In Render service Settings, add your custom domain.
2. At your DNS provider, create exactly the DNS records Render displays for that domain.
3. Wait for Render to verify the domain and issue its HTTPS certificate.
4. Set `APP_URL` to the single canonical HTTPS origin, for example `https://www.yourstudio.com`.
5. Save and redeploy/restart as prompted.
6. Use that exact domain for both website and admin. Verify login, contact and booking forms again.

Do not include `/admin`, a path or query string in `APP_URL`. The application checks write-request origins and generates metadata from this setting. The alternative `onrender.com` hostname may still show pages, but forms from that hostname will be rejected after you choose a custom canonical origin. Use the canonical link in your marketing and bookmarks.

## 10. Make future updates

1. Back up the running service before changing application/database code.
2. Edit source locally, then run build and relevant tests.
3. Commit and push to the connected branch.
4. Use Render's configured auto-deploy behavior or **Manual Deploy → Deploy latest commit**.
5. Review logs and run the key health/login/booking checks.

Deploy updates to the **same service with its existing disk**. A new service has new storage. Never delete the service/disk to solve a normal build problem. Keep `SESSION_SECRET` stable: changing it invalidates sessions, signed guest upload cookies and existing customer booking codes.

Applied SQL migration files have recorded checksums. Add a new numbered migration for future schema changes; editing `001` or `002` after deployment intentionally prevents startup. A code rollback does not reverse schema changes. Restore compatible code and a verified backup when necessary.

## 11. Backups and recovery

CSV exports are useful for records but are not a complete application backup. The included backup script uses SQLite's backup API and copies the uploads referenced by that snapshot. Avoid uploading/deleting media during the copy. If anything fails, a backup remains incomplete and should not be used.

### Create a backup

In the running Render service's **Shell**, run:

```sh
npm run backup
```

It prints an absolute new directory under `/var/data/onyx/backups/`. A successful directory contains `onyx.sqlite`, `uploads/`, and `COMPLETE.json` with checksums. The final log begins `Complete backup:`. Check that message before continuing.

Copy the entire backup directory to a secure independent location. A backup left on the same disk does not protect against loss of that disk. Keep a secure copy of `SESSION_SECRET` alongside your recovery records, separately from public source code. Backups contain private customer information and password hashes.

For transfer, follow Render's official disk/SSH file-transfer instructions: https://render.com/docs/disks#transferring-files . Copy the service-specific SSH target from Render; do not invent a hostname. For example, on your computer, substituting the exact SSH target and printed backup path:

```sh
scp -r YOUR_RENDER_SSH_TARGET:/var/data/onyx/backups/EXACT_BACKUP_FOLDER ./onyx-backup
```

This uses your authorized SSH key. If your service requires additional SSH options, use the options shown by Render. Verify the downloaded folder contains the database, images and `COMPLETE.json`. Back up regularly and before significant updates; automatic offsite backups are not configured in this package.

### Restore into a new data directory

1. Choose a maintenance window and stop accepting bookings/edits during recovery.
2. Make the complete verified backup folder available on the service disk.
3. In service Shell, run, replacing the example backup directory:

```sh
npm run restore -- /var/data/onyx/backups/EXACT_BACKUP_FOLDER /var/data/onyx-restored
```

4. The destination **must not already exist**. The script checks file hashes and SQLite integrity, then restores a new copy. It does not overwrite the current database.
5. Set `DATA_DIR=/var/data/onyx-restored` in Render and redeploy/restart. Keep the same `/var/data` disk and `SESSION_SECRET`.
6. Check health, sign-in, booking counts, private/public images and customer access codes.
7. Keep the previous data directory until recovery is verified. Any activity after the chosen backup time is not part of that backup.

Do not copy only an active `onyx.sqlite` file while ignoring its WAL state. Use the provided snapshot command. Do not rely on generic disk snapshots as the only database recovery strategy.

## 12. Recover a forgotten owner password

If another SUPER_ADMIN can sign in, they can set a new password in Users & roles. Otherwise:

1. Confirm Render's `ADMIN_EMAIL` names the existing owner account.
2. Open the running service's Shell.
3. Run `npm run admin:reset`.
4. Type `RESET` when asked.
5. Save the newly generated password shown in that private shell.
6. Sign in at `/login` and change it at `/password` if desired.

This resets only the existing owner identified by `ADMIN_EMAIL` and revokes that user's sessions. It does not delete bookings or create a new database. There is no forgotten-password email integration.

## 13. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Render cannot find `package.json` | Files are nested incorrectly; put project contents at repo root or set the correct Root Directory in manual setup. |
| Blueprint cannot find configuration | `render.yaml` must be committed at the chosen Blueprint path. |
| Node/`node:sqlite` error | Verify `NODE_VERSION=24.19.0`, `.node-version` and the build log's actual runtime. |
| `npm ci` lockfile error | Commit the included `package-lock.json`. After intentionally editing dependencies, regenerate it with `npm install`, test, then commit both files. |
| Build exits due to memory | Confirm the selected build resources and paid service configuration. This project limits build workers to two; increase available build memory if needed. |
| `SESSION_SECRET` error | Set a random value at least 32 characters long; avoid changing an existing secret. |
| Initial password validation error | Set `ADMIN_EMAIL` and a 12–128 character `ADMIN_PASSWORD` before first start. |
| Login still rejects a new environment password | Existing passwords are preserved. Use `/password` or `npm run admin:reset`. |
| “Open this form using the configured website address” | Use exactly `APP_URL`, or remove an accidental `APP_URL` override to use the default Render URL. Local default is `http://localhost:3000`. |
| Login succeeds but returns to login | Check HTTPS, cookies, correct hostname, stable secret, and whether the account is active. Do not configure `http://` for Render. |
| Admin loads but content list is empty | Click LOAD DEMO CONTENT once on Overview, or add your own content. |
| Health is 503 / missing tables | Start with `npm start`, not bare `next start`; the wrapper runs migrations. Check disk write permission and migration logs. |
| Data/images vanish after redeploy | Check the actual persistent disk mount `/var/data` and `DATA_DIR` underneath it. Fix immediately; earlier ephemeral data may not be recoverable. |
| “An applied migration was changed” | Restore that migration's original contents; implement changes in a new numbered file. |
| A booking time cannot be confirmed | Assign a published artist, use a future working date, avoid holidays/conflicts, and keep the whole session inside working hours. |
| Private image is unauthorized | Use the original guest browser for its temporary upload preview, or sign in as permitted staff. Private files are not public asset URLs. |
| Stock photo does not load | It relies on an external CDN; upload your own photo and update content. Fonts themselves are bundled locally. |
| Emails/reminders do not arrive | No outbound provider is connected; `not_configured` means not sent. Staff must contact the customer manually. |
| Too many attempts (429) | Limits use hourly counters. Wait for the next hour and avoid repeated sign-in/form retries. |
| Local port already in use | Stop the other server, or set matching `PORT` and `APP_URL` in your local environment. |

## 14. Scope and official references

This is the complete package for the included release, not a claim that all optional items in the original extended specification are implemented. Read `FEATURES_AND_LIMITS.md`. No existing live customer database is bundled, and no deployment was made to your Render account while preparing this ZIP.

Official Render documentation checked during preparation:

- Next.js on Render: https://render.com/docs/deploy-nextjs-app
- Web services: https://render.com/docs/web-services
- Blueprint fields: https://render.com/docs/blueprint-spec
- Persistent disks and limitations: https://render.com/docs/disks
- Environment variables: https://render.com/docs/environment-variables
- Node version: https://render.com/docs/node-version
- Health checks: https://render.com/docs/health-checks
- Custom domains: https://render.com/docs/custom-domains

Dashboard wording and pricing can change. Prefer the supplied exact build/start/disk settings and Render's current displayed options.
