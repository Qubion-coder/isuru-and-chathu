# Google Sheets setup (RSVP + Wishes)

1. Open the sheet: https://docs.google.com/spreadsheets/d/1D8_HZXQB7HGUWXxglJFHBANvGD1q3XqmeSJ8K7_G5Lo/edit
2. Extensions > Apps Script. Delete everything in Code.gs and paste the full contents of `code.ts` (project root).
3. Save. Optionally run `setupSheets` once to create the RSVP and Wishes tabs now (they are also created automatically on the first submission).
4. Deploy > New deployment > type: Web app. Execute as: Me. Who has access: Anyone. Deploy and authorize.
5. Copy the Web app URL (ends in `/exec`) and paste it into `src/config.ts` (or set `VITE_GOOGLE_APPS_SCRIPT_URL`).
6. After changing the script later, use Deploy > Manage deployments > Edit > New version so the URL stays the same.

Sheets created:
- RSVP: Timestamp | Full Name | Phone | Attendance | Guests | Dietary Notes
- Wishes: Timestamp | Guest Name | Message
