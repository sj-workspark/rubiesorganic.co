# Rubies Organic Project Guide

## Main pages
- Home: index.html (page-home)
- Shop: index.html (page-shop)
- About: index.html (page-about)
- Contact: index.html (page-contact)
- Register: index.html (page-register)

## Main frontend files
- index.html: main single-page app structure and page content
- contact.js: opens the device SMS composer with the direct correspondence form details
- javascript.js: shop/cart/order UI, contact form logic, checkout flow
- shop.js: shop experience and ordering interactions
- nav.js: mobile navigation behavior
- logistics.js: registration and membership flow
- style.css: site styling

## Backend
- rubies-backend/server.js: main Express API for orders and contact inquiries
- rubies-backend/worker.js: background notification worker
- rubies-backend/notifications.js: WhatsApp/SMS order notification helper

## Scripts and utilities
- scripts/test_order.js: order API smoke test
- scripts/test_notifications.js: notification helper test
- package.json: npm scripts and dependencies
- netlify.toml: Netlify deployment and security headers

## Common tasks
- Start app: npm start
- Run build: npm run build
- Test order flow: npm run test:order
- Deploy: netlify deploy --prod
