# DIGIVO Frontend Prototype

Frontend prototype for the DIGIVO service catalogue. This is a static HTML/CSS/JavaScript prototype, not the production Next.js + Supabase application.

## Run locally
- Extract the ZIP.
- Open `index.html` in a browser, or use a simple local static server.
- Internet is needed for the Google Fonts import; the rest of the frontend is local.

## Before publishing
1. Open `app.js`.
2. Replace `WHATSAPP_NUMBER` with the official business number in international format, digits only (example format: `62xxxxxxxxxxx`). The current number is a placeholder and is not a real DIGIVO contact.
3. Verify all service descriptions, prices, and permitted service scope.
4. Test all links on mobile and desktop.

## Included interactions
- Search across service names and descriptions.
- Category filters.
- Service details dialog.
- WhatsApp Click to Chat with a prefilled message.
- Mobile navigation and FAQ accordions.

## Not implemented yet
- Admin login and dashboard.
- Database or persistent service management.
- Order tracking, inventory, payment, or analytics.
- Production privacy/terms pages.

Do not deploy as a production-ready admin system. The admin/backend is a later implementation stage.
