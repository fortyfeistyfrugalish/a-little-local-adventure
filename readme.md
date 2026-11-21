# FFF Events Gallery (deployment-ready scaffold)

A separate Netlify site for two collections: Lancaster County and Susquehanna Valley & Beyond.

## Setup
1. Deploy this folder as a new Netlify site (do not overwrite the recipes/deals sites).
2. Provide a secure **read-only JSON endpoint** that reads only eligible entries from the existing Google Sheet, rather than making the entire sheet public. Set its URL as the Netlify environment variable `EVENTS_FEED_URL`.
3. JSON endpoint format: `{ "events": [{"id":"...","name":"...","category":"...","description":"...","startDate":"2026-11-18","startTime":"19:00","endDate":"2026-11-18","endTime":"20:00","venue":"...","city":"York","admission":"Free","cost":"Free","url":"https://...","image":"","region":"Susquehanna Valley & Beyond","reviewStatus":"Approved","publishingStatus":"Ready"}] }`.
4. Do not include events with missing required details. The frontend never displays unapproved entries; the server also checks statuses and date.
5. Embed the resulting Netlify site on Squarespace after testing.

## Important
The site is **not yet connected to the Google spreadsheet**. A separate authenticated read-only Sheets-to-JSON endpoint is required. No events have been deployed or published by this package.
The function compares event end dates and times using America/New_York local time, including daylight saving time.


## Category image fallbacks
Card images automatically use an approved event-specific `image` if available; otherwise the matching reusable GitHub category image. If an image fails to load, the existing Around Town fallback appears. Category mapping is defined in `script.js`. The GitHub images are stored in `fortyfeistyfrugalish/a-little-local-adventure/images`.
