# Savory Bites Restaurant Website

A responsive restaurant website built with Next.js App Router, React, TypeScript, and regular CSS. The frontend presents Savory Bites in Kakamega and gives visitors ways to explore the menu, prepare an order, request a table, and contact the restaurant.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful project commands:

```bash
npm run lint
npm run build
npm start
```

## Website features

- Responsive restaurant homepage with an editorial visual style, food photography, story section, and menu.
- Menu search and category filters, with quantity controls and a cart total.
- Pickup or delivery selection. Delivery orders require an address in Kakamega.
- WhatsApp order handoff with the selected dishes, quantities, total, and fulfilment preference included in the message.
- Table request form for a date, time, guest count, name, and phone number. Requests are marked pending in the browser and WhatsApp opens so the visitor can ask the restaurant to confirm.
- Kakamega Town location, P.O. Box 48654-597, clickable phone number, Google Maps search link, and opening hours from Monday through Sunday, 7:00 AM–8:00 PM.
- Floating WhatsApp contact link.
- Footer with quick links, contact details, WhatsApp and directions links, responsive layout, reduced-motion support, back-to-top button, and current-year copyright.
- Newsletter email validation and clear feedback. The form does not send or save email addresses because no newsletter service is connected.
- Next.js image optimization for Unsplash photos, restricted to `images.unsplash.com` in `next.config.ts`.

## Where things live

- `app/page.tsx` — homepage sections and page composition.
- `app/restaurant-tools.tsx` — menu search, cart, WhatsApp ordering, and reservation form.
- `app/site-footer.tsx` — footer content and newsletter interaction.
- `app/whatsapp-share.tsx` — restaurant WhatsApp contact button.
- `app/globals.css` — responsive site and footer styling.
- `app/layout.tsx` — root layout and page metadata.
- `next.config.ts` — approved remote image host for Next.js Image.

## Frontend storage and service setup

Cart contents and the most recent reservation request are stored in the visitor’s browser using `localStorage`. They are not shared with restaurant staff or synchronized between devices. WhatsApp is used to send the prepared order or reservation message; the restaurant must confirm availability and payment directly.

This project does not yet include:

- A server database or staff dashboard for orders and reservations.
- Reservation confirmation and cancellation controls.
- M-Pesa or card processing. Payment confirmation should be implemented and verified by a payment provider on the server.
- A newsletter service, restaurant email address, or Instagram, Facebook, and TikTok profile URLs.
- Privacy Policy or Terms and Conditions pages.

Add those integrations and the restaurant’s real URLs and email address before treating the site as a complete production ordering or marketing system.

## Verification

The current frontend passes ESLint and the Next.js production build:

```bash
npm run lint
npm run build
```
