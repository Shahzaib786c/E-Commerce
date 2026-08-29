# Cuddle & co. — Kids gifting & soft toys store (frontend)

A React + React Router (v6.4+ data-router API) frontend, built with plain CSS
(no Tailwind), hardcoded/mock data standing in for a future SAP-backed API.

## Setup

This project could not be `npm install`-ed in the build sandbox (no internet
access there), so **you'll run the install yourself**:

```bash
cd cuddle-co
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Test accounts

**Customer login** (My Orders, Checkout):
- Email: `ayesha@example.com`
- Password: `password123`

**Admin login** (`/admin`):
- Email: `admin@cuddleco.com`
- Password: `admin123`

You can also just click "Create an account" to register a new customer —
it's stored in `localStorage`, no backend needed.

## What's implemented

**Public storefront**
- Home (hero, category tiles, bestsellers, promo banner, testimonials)
- Products (search, sort, pill-style category filters, pagination)
- Product details (image gallery, variants, quantity, reviews)
- Cart, Wishlist (guest-accessible, no login required)
- Checkout (Safepay + Cash on Delivery, gated behind login)
- Order success, My Orders (order history + live status)

**Auth**
- Login / Register / Forgot password — no navbar/footer (`AuthLayout`)
- Protected routes redirect to login and return you to where you were headed

**Admin panel** (`/admin`, requires the admin account)
- Dashboard (stat cards, recent orders)
- Categories — List / Add / Edit
- Products — List / Add / Edit / View (with real image upload + live preview)
- Orders — List / View+Edit (inline status dropdown: Pending → Shipped →
  Delivered → Cancelled — updates instantly on the customer's My Orders page
  too, since both read from the same shared order store)
- Customers — List / Add / Edit / View

## Architecture notes (for when you connect the real SAP backend)

- **`src/context/`** — every piece of shared state (auth, cart, wishlist,
  orders, products/categories) lives behind a Context + custom hook
  (`useAuth()`, `useCart()`, etc). Components never touch mock data directly.
  When you're ready to connect SAP/a real API, you only need to change the
  *inside* of these context files — swap the `useLocalStorage` mock logic for
  real `fetch`/axios calls. No component code needs to change.
- **`src/data/`** — the "fake backend." Seed data for products, categories,
  and customers.
- **Product image uploads** in the admin form use `URL.createObjectURL()` —
  this works great for a live session/demo, but the blob URLs don't survive
  a hard refresh (no real file storage yet). Products without a valid image
  reference will need a fallback once this happens — worth handling when
  the backend is wired up.
- **Order IDs** are randomly generated client-side (`CC-XXXXX`) — a real
  backend would generate these server-side.

## Design tokens

All colors/type/spacing live in `src/styles/tokens.css` as CSS custom
properties — change the palette or fonts there and it cascades everywhere.
No Tailwind, no CSS-in-JS, just plain CSS with BEM-ish component stylesheets
co-located next to their components.
