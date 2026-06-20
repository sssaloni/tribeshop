# TribeShop - Production-Ready E-Commerce App

TribeShop is a premium, modern e-commerce application built with a React + Vite frontend and a Node.js + Express + PostgreSQL (Supabase) backend.

## Tech Stack

- **Frontend**: React, Vite, React Router, Context API (cart state), Axios, Premium Vanilla CSS.
- **Backend**: Node.js, Express, PostgreSQL (Supabase Connection Pool), JWT Authentication, bcryptjs password hashing.

---

## Folder Structure

```
tribeshop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL Pool Connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Admin authentication logic
│   │   │   ├── order.controller.js   # Transactional order placement
│   │   │   └── product.controller.js # Product CRUD operations
│   │   ├── db/
│   │   │   ├── schema.sql            # PostgreSQL Schema setup
│   │   │   └── seed.sql              # Database seed data
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT authorization validator
│   │   │   ├── error.middleware.js   # Global API error handler
│   │   │   └── validator.middleware.js # Body parameters verification
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoint binds
│   │   │   ├── order.routes.js       # Orders endpoint binds
│   │   │   └── product.routes.js     # Products endpoint binds
│   │   └── server.js                 # Express server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic navigation header
│   │   │   └── ProtectedRoute.jsx    # Admin guard wrapper
│   │   ├── context/
│   │   │   └── CartContext.jsx       # State management for cart
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── ProductList.jsx       # Catalog listing & search filters
│   │   │   ├── ProductDetail.jsx     # Detail view with stock limits
│   │   │   ├── Cart.jsx              # Checkout totals summary
│   │   │   ├── Checkout.jsx          # Checkout forms & submissions
│   │   │   ├── OrderSuccess.jsx      # Confirmation screen
│   │   │   ├── AdminLogin.jsx        # Admin credential check
│   │   │   ├── AdminDashboard.jsx    # Metrics and inventory status
│   │   │   ├── AdminProducts.jsx     # Product CRUD panel & modal forms
│   │   │   └── AdminOrders.jsx       # Order management interface
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with auth interceptor
│   │   ├── App.css                   # Styles cleanup file
│   │   ├── App.jsx                   # React Router endpoints
│   │   ├── index.css                 # Premium custom CSS theme
│   │   └── main.jsx                  # React entry point
│   ├── .env.example
│   └── package.json
├── ARCHITECTURE.md           # System Architecture & Design documentation
└── README.md
```

---

## Getting Started

### 1. Database Setup (Supabase / PostgreSQL)

1. Create a project at [Supabase](https://supabase.com/).
2. Navigate to your Supabase project **Database Settings** to copy the PostgreSQL connection URI string.
3. Open the Supabase **SQL Editor** or run a SQL tool against your database.
4. Copy the contents of `backend/src/db/schema.sql` and execute the query to set up the database tables and indexes.
5. Copy the contents of `backend/src/db/seed.sql` and execute it to populate initial products and the default administrator user.

*Note: The seeded default admin username is `admin` and the password is `adminpassword123`.*

---

### 2. Configuration Setup

#### Backend (`backend/`)
1. Create a `.env` file in the `backend/` directory based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
2. Update the `DATABASE_URL` with your Supabase database URL connection string.
3. Define a custom `JWT_SECRET` for securing admin sessions.

#### Frontend (`frontend/`)
1. Create a `.env` file in the `frontend/` directory based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
2. Verify that `VITE_API_URL` points to your backend URL (default is `http://localhost:5000/api`).

---

### 3. Install Dependencies & Run

#### Run the Backend API Server:
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run in development mode (starts hot-reloads via nodemon on port 5000):
   ```bash
   npm run dev
   ```

#### Run the Frontend Dev App:
1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development Vite server (usually starts on port 5173):
   ```bash
   npm run dev
   ```
4. Click on the local address (e.g. `http://localhost:5173`) to view and interact with the premium storefront!
