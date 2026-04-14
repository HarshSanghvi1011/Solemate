# SOLEMATE — MERN e-commerce (full stack)

Dark-themed storefront and admin dashboard with **JWT authentication**, **bcrypt** password hashing, **MongoDB** persistence, **Helmet** + **CORS** on the API, and a **React + Vite + Tailwind** frontend.

## Prerequisites

- **Node.js** 18+ (includes `npm`)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Project layout

| Folder   | Role |
|----------|------|
| `server/` | Express API, Mongoose models, JWT auth, seed script |
| `client/` | React UI (shop, cart, auth, admin) |

## Images

Product and hero images are loaded from **Unsplash URLs** stored in the database (see `server/seed.js`). You do not need local image files for the app to run. To use your own files, put them under `client/public/` and set `imageUrl` in the admin “Add product” form to paths like `/your-file.jpg`.

## Setup

### 1. MongoDB

Start local MongoDB, or create a cluster in Atlas and copy the SRV connection string.

### 2. API (`server`)

```bash
cd server
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET (long random string), CLIENT_ORIGIN=http://localhost:5173
npm install
npm run seed
npm run dev
```

The API listens on **http://localhost:5000** (or `PORT` from `.env`).

- **Admin demo login:** `admin` / `admin123` (created by seed)
- Seed wipes **products** and **admin users** each run, then recreates the demo admin and 12 products.

### 3. Frontend (`client`)

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. In development, `/api` is proxied to the backend (see `client/vite.config.js`).

For a **production build** served separately from the API, set `VITE_API_URL` to your API origin (no trailing slash), e.g. `https://api.example.com`, then:

```bash
npm run build
npm run preview
```

## Security features (implemented)

- Passwords hashed with **bcryptjs**
- **JWT** bearer tokens for customers and admins (separate storage keys on the client)
- **express-validator** on register/login and product create
- **helmet** and **morgan** on the API
- **CORS** restricted to `CLIENT_ORIGIN`
- Sensitive config in **`.env`** (never commit real secrets)

## Main routes (store)

- `/` — Home + trending products  
- `/shop` — Collection with search, category, price range  
- `/cart` — Cart (requires sign-in); checkout creates an order  
- `/auth` — Customer sign in / sign up  

## Admin

- `/admin/login` — Admin portal (username/password)  
- `/admin` — Dashboard (stats, revenue chart, recent orders)  
- `/admin/products` — CRUD-style product management + add modal  
- `/admin/orders` — Orders list + status updates  

## API overview

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register` | Customer |
| POST | `/api/auth/login` | Customer (email) |
| POST | `/api/auth/admin/login` | Admin (username) |
| GET | `/api/auth/me` | Current user (Bearer token) |
| GET | `/api/products` | Public list + filters |
| GET | `/api/products/trending` | Featured products |
| POST/PATCH/DELETE | `/api/products`… | Admin only |
| GET/POST… | `/api/cart`… | Customer Bearer token |
| GET/POST | `/api/orders` | Customer creates; admin lists all |
| PATCH | `/api/orders/:id/status` | Admin |
| GET | `/api/stats`, `/api/revenue-chart`, `/api/orders/recent` | Admin |

## Troubleshooting

- **Cannot connect to MongoDB:** Check `MONGODB_URI` and that MongoDB is reachable (local service or Atlas IP allowlist / user password).
- **CORS errors:** Ensure `CLIENT_ORIGIN` in `server/.env` matches the exact URL of the Vite dev server (including port).
- **401 on admin:** Sign in again at `/admin/login`; seed resets the admin user if you re-ran `npm run seed`.
