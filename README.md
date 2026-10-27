# Savory Bites Restaurant Website

A responsive restaurant website for Savory Bites in Kakamega, built with the Next.js App Router, React, TypeScript, and regular CSS. It introduces the restaurant, presents its current menu, and lets visitors prepare orders and table requests for WhatsApp.

## Run locally

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## What the website includes

### Restaurant presentation

- Responsive homepage with the existing Savory Bites visual design, typography, colors, animations, and navigation.
- Hero section with local food photography, restaurant story, and menu links.
- Restaurant location details: Kakamega Town and P.O. Box 48654-597.
- Click-to-call phone number: +254 112 810 217.
- Google Maps search links for Savory Bites in Kakamega Town.
- Opening hours listed for Monday through Sunday: 7:00 AM–8:00 PM every day.
- Floating WhatsApp contact button and WhatsApp contact link in the footer.

### Menu and online ordering

- Current menu items and prices:
  - Grilled Chicken — KSh 850
  - Classic Beef Burger — KSh 650
  - Italian Pizza — KSh 1,200
- Search by dish name or description and filter by Chicken, Beef, and Fast Food.
- Fish, Kenyan Favourites, and Drinks appear as disabled categories because no dishes are currently listed for them. Add confirmed menu data before enabling those categories.
- Add dishes to the order, increase or decrease quantities, and remove items by reducing their quantity to zero.
- Order summary shows each item’s unit price, line total, and an accurate subtotal based on the menu prices.
- Choose pickup or delivery. A delivery address is required before checkout; no delivery charge is added to the subtotal.
- WhatsApp checkout prepares a message with selected dishes, quantities, prices, subtotal, and fulfilment details using the restaurant’s existing WhatsApp number.
- Cart contents are saved in the visitor’s browser with `localStorage` and restored on the next visit to that browser.
- Loading, empty cart, and checkout feedback states are included. WhatsApp opens with a draft; customers must review and send the message for the restaurant to receive the request.

### Table requests

- Reservation form collects a name, phone number, date, time, and number of guests.
- Requests are saved locally in the visitor’s browser and displayed as **Pending**.
- The form opens WhatsApp with a request for the restaurant to confirm the booking.

### Footer

- Restaurant branding and tagline, quick links, location, phone, directions, WhatsApp, and social profile placeholders.
- Newsletter form validates the email format and gives feedback. It does not send or permanently save addresses because no newsletter service is connected.
- Back-to-top button, dynamically generated copyright year, responsive layout, accessible focus styles, and reduced-motion support.
- Privacy Policy and Terms and Conditions are marked as pages that still need to be created.

### Food photography

Food images are stored locally in `public/images/food/` so the hero and menu photos do not rely on external image URLs at runtime:

- `hero-grilled-meal.jpg`
- `grilled-chicken.jpg`
- `classic-beef-burger.jpg`
- `italian-pizza.jpg`

The About section uses a separate restaurant interior photo.

## Project files

- `app/page.tsx` — homepage sections, opening hours, location, and composition.
- `app/restaurant-tools.tsx` — menu filtering, cart, WhatsApp checkout, and reservation form.
- `app/menu-data.ts` — menu items, category assignments, cart helpers, subtotal calculation, and WhatsApp message creation.
- `app/site-header.tsx` — responsive site navigation.
- `app/site-footer.tsx` — footer content, newsletter feedback, and back-to-top interaction.
- `app/whatsapp-share.tsx` — WhatsApp contact link.
- `app/globals.css` — site styling, responsive layouts, focus states, and reduced-motion behavior.
- `app/layout.tsx` — root layout, fonts, and metadata.
- `public/images/food/` — local food photography.
- `tests/menu-order.test.mjs` — menu filtering, cart quantity, subtotal, and WhatsApp checkout tests.
- `next.config.ts` — Next.js configuration, including the remote image host used by the About section.

## Run checks

```bash
npm run test:menu
npm run lint
npm run build
```

The menu tests cover category filters, adding and removing quantities, subtotal calculations, and the generated WhatsApp checkout message and URL.

## Current limitations

This is a frontend project. Cart contents and the latest reservation request stay in the visitor’s browser; restaurant staff do not receive or manage them through a database or dashboard. Orders and reservations are only sent to the restaurant if the customer sends the prepared WhatsApp message. The site does not process M-Pesa or card payments.

Newsletter signup does not store addresses. The restaurant email address and Instagram, Facebook, and TikTok profile URLs have not been provided. Privacy Policy and Terms and Conditions pages have not been created. Additional menu categories should be populated only after the restaurant confirms those dishes and their prices.
