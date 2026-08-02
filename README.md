# Zaiqa — Food Ordering Website

A responsive food ordering site with a dynamic menu, cart, checkout, and an
admin panel for managing the menu and incoming orders.

**Stack:** React (Vite) frontend · PHP REST API backend · MySQL database

---

## 1. Project structure

```
food-ordering-app/
├── backend/          PHP API — see "Backend setup" below
│   ├── config/        DB connection, CORS headers, admin-token check
│   ├── api/            categories.php, menu.php, orders.php, auth.php
│   └── database.sql   Run this to create the database + seed data
└── frontend/          React app (Vite) — see "Frontend setup" below
    └── src/
        ├── components/   Navbar, cart drawer, menu grid, admin widgets…
        ├── pages/         Home, Checkout, OrderConfirmation, Admin*
        ├── context/       CartContext (global cart state)
        └── services/      api.js — talks to the PHP backend
```

## 2. Backend setup (XAMPP / Laragon / MAMP)

1. Copy the `backend/` folder into your server's web root, e.g.
   `C:\xampp\htdocs\food-ordering-app\backend` (Windows/XAMPP) or
   `C:\laragon\www\food-ordering-app\backend` (Laragon).
2. Start Apache and MySQL from your control panel.
3. Open phpMyAdmin and import `backend/database.sql`. This creates the
   `zaiqa_db` database, all tables, sample menu items, and a default
   admin login (**username:** `admin`, **password:** `admin123`).
4. If your MySQL username/password differ from the defaults (`root` / no
   password), edit `backend/config/database.php`.
5. Confirm the API works by visiting, e.g.:
   `http://localhost/food-ordering-app/backend/api/categories.php`
   You should see a JSON list of categories.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

If your backend lives at a different URL, update `API_BASE` in
`frontend/src/services/api.js`.

## 4. Using the site

- **Customers:** browse the menu at `/`, filter by category, add items to
  the cart (the slide-out "order chit"), and check out at `/checkout`.
  Placing an order shows a token number at `/order-confirmation`.
- **Admin:** go to `/admin/login`, sign in with `admin` / `admin123`, and
  manage menu items or update order statuses from `/admin`.

## 5. Notes for extending this project

- Menu item images: paste any public image URL into the `image_url` field
  when adding/editing a menu item from the admin panel.
- Delivery fee is currently a flat `Rs 100`, set in `Checkout.jsx` and
  `orders.php` — easy to change to a distance-based calculation later.
- Admin auth uses a simple bearer token stored in the `admins` table
  (expires after 8 hours). For a production deployment you'd want to
  move to JWT or a proper session/auth library, plus HTTPS.
- To add more admins, insert a new row into the `admins` table with a
  bcrypt-hashed password (`password_hash('yourpassword', PASSWORD_BCRYPT)`
  in a small PHP script, or reuse `auth.php`'s hashing logic).
