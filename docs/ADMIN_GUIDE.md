# Using the website and admin panel

## Sign-in and initial setup

Open `/admin` and sign in with your own administrator email/password. A session lasts up to 12 hours. Sign out using the footer link and confirm the sign-out action. Change your password at `/password`.

The first user created from the environment has the `SUPER_ADMIN` role. On Overview, click **LOAD DEMO CONTENT** once to initialize the editable collection. This does not generate fake customer bookings. The demo collection contains clearly labeled placeholder profiles and illustrative stock photographs.

In Settings, enter verified studio name, address, contact email/phone, WhatsApp number, Instagram HTTPS URL, opening hours and your introduction. Blank optional contact fields are hidden. WhatsApp needs country code and digits only, with no `+` or spaces. The link opens WhatsApp; the app does not send WhatsApp messages itself.

Timezone is Asia/Kolkata and currency is INR. Price/payment amounts are whole rupees.

## Content and images

Use Artists, Portfolio, Tattoo styles, Services, Journal, Offers, Flash designs, FAQs, Gallery, Testimonials and other content sections to manage records. Use meaningful URL slugs, unique within a content type.

1. Add a record or open an existing demo record.
2. Edit its title, description, image and relevant fields.
3. Set display order; smaller numbers sort first.
4. Choose `draft`, `published` or `archived`. Only published records appear publicly.
5. Add image alt text and relevant SEO title/description.
6. Preview the editor's content, then save.
7. Only remove the demo checkbox after replacing its content with genuine approved studio material.

The editor uses plain text; it is not a rich-text/page-layout builder. Some visual layout, fixed headings and hero/banner image mappings are source-level components in `components/onyx/public-site.tsx` and `lib/onyx-images.ts`. To replace a fixed image, upload your studio photo, copy its URL and replace the relevant mapping in `lib/onyx-images.ts`, then redeploy. Regular portfolio/artist image fields can be changed directly in admin. This is not an arbitrary drag-and-drop site builder.

Media library accepts JPEG, PNG and WebP images under 8 MB. Uploads are checked for matching file signatures and MIME types. Optimize large photographs before upload; automatic compression, video and document uploads are not included. For images intended for website content, upload through Media library or the content editor's upload control. Copying a media URL is available in the library.

An image referenced by a content record cannot be deleted until the content reference is replaced. Uploaded public images are public; do not put confidential customer photographs in this library. Private booking references are stored separately and visible to their uploading browser temporarily and authorized staff. Assigned artists can view references for their own bookings.

## Artists and availability

For each published artist, set working days as comma-separated numbers: `0` Sunday, `1` Monday, through `6` Saturday. Set opening/closing hours in 24-hour format. Add artist-specific blocked dates as `YYYY-MM-DD`, comma-separated. Studio holidays in Settings apply across artists.

Availability is shown in half-hour slots. Requests must be future dates within approximately one year. Use the date picker and the studio's IST time. A pending request is only a preference and does not reserve capacity.

## Processing a booking

1. The customer completes the five-stage form and confirms age/consent. Up to three private reference images can be attached.
2. The app stores a `PENDING` request and shows the customer a booking ID and private access code.
3. The request appears in Overview, Bookings and the admin notification inbox.
4. Open the booking, review the customer's idea and reference images, and contact them directly when needed.
5. Assign an artist, choose date/time and duration, and enter a quote and any manually received payment.
6. Set status to `CONFIRMED` and save. The whole session reserves half-hour slots atomically, preventing overlaps for that artist.
7. Use the day/week/month calendar to view sessions. Editing happens in the booking modal; the calendar is not drag-and-drop.
8. Update to Completed, Cancelled or No-show when appropriate. Cancelling releases the reserved time. Completed/no-show sessions retain their recorded occupied slots.

If the save reports a conflict, choose a different artist/time or release an existing session deliberately. Failed conflicts do not partially overwrite the booking.

Private studio notes are visible to staff and excluded from customer tracking responses. Customers sharing an email do not gain access to each other's booking details: each request has its own code.

## Customer tracking

`/account` asks for the private access code issued at submission. The confirmation link contains it in the URL fragment and the page removes that fragment after reading it. Customers should save the code somewhere private before navigating away. Treat it like a password: someone holding it can view the limited booking details and send change requests.

The tracking page shows appointment/status information and allows a cancellation or rescheduling **request**. It creates an admin notification; staff must review and update the actual booking. The app does not automatically cancel slots, collect money, issue refunds or send email.

There is no customer email/password signup or automatic lost-code recovery. If a customer loses the code, verify them using your studio's own process and communicate directly. Changing `SESSION_SECRET` invalidates old access codes.

## Customer records, inbox and payments

Customers are created automatically from booking submissions. The Customers section shows booking history and private studio notes. Contact-form submissions appear under Enquiries; mark them read or resolved after handling them.

The notification list distinguishes internal notifications from outbound email intents marked `not_configured`. Those entries have not been delivered. Pricing is a basic estimate; the studio makes the final quote. Payment amounts/status are manual records only. Updating them does not move funds or perform a refund.

Bookings and customers can be exported to CSV from their lists. Keep exports private. Full backups use the command in the deployment guide, not CSV alone.

## Staff accounts and roles

A SUPER_ADMIN opens Users & roles, clicks Add access, supplies an email, name, role and initial password of at least 12 characters, and saves. Share that initial password securely; no invitation email is sent. The staff member can change it at `/password`.

When editing an existing account, leave the new-password field blank to retain its password. Set a new password to revoke existing sessions. Disabling an account revokes its sessions and prevents login. Email is the account's lookup key: do not change it to rename a user; create the replacement account and disable the old one when appropriate.

| Role | Access |
| --- | --- |
| SUPER_ADMIN | Full studio operations, settings and user administration |
| ADMIN | Content/media and studio operations; no settings/user administration |
| MANAGER / STAFF | Bookings, customer notes, calendar, enquiries and internal notifications |
| ARTIST | Read-only assigned bookings; link the account to its artist record |
| VIEWER | Read-only operational/content access; no settings/user management or changes |

Viewers can read customer/operational data, so grant that role only to trusted staff. Artist access is narrower. Audit history records key mutations and sign-in/password changes; passwords are excluded. Analytics shows simple event counts, not unique people or a full analytics platform.

## Routine operation

Check bookings/enquiries regularly, contact customers manually, keep studio details accurate, back up before major changes, copy backups off the service, monitor disk capacity, and periodically test restoring a backup. Review demo policy/aftercare text with the studio before commercial use.
