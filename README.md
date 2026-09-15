# iNova

A server-rendered e-commerce application built with **Express**, **EJS**, and **MongoDB**, following an **MVC architecture**. Users can browse products, register as sellers to list items, and manage a shopping cart.

---

## Features

* **Authentication:** User signup, login, logout, and session-based authentication.
* **Seller Onboarding:** Any registered user can apply to become a seller, verified via a one-time passcode (OTP) sent to their email.
* **Product Management:** Verified sellers can create, edit, and delete their own product listings. Anyone can browse products and view detailed pages.
* **Seller Dashboard:** Centralized management interface for sellers to monitor their own product listings.
* **Cart System:** Add products to a personal cart, modify item quantities, remove items, and track total cost in real time. *(Checkout/orders planned).*
* **Flash Notifications:** Real-time success, error, and warning alerts across all user actions.
* **Security:** CSRF protection applied to all state-changing forms.

---

## Tech Stack

* **Backend:** Node.js, Express (v5)
* **Templating:** EJS + `express-ejs-layouts`
* **Database:** MongoDB via Mongoose
* **Session & Auth:** `express-session`, `connect-flash`, `bcrypt`
* **Email Service:** Nodemailer
* **Styling:** Bootstrap 5

---

## Project Structure

```text
iNova/
├── server.js                  # App entry point — middleware, routers, error handling
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── controller/            # Route handlers (auth, product, seller, cart)
│   ├── middleware/             # Auth guards, CSRF protection
│   ├── model/                  # Mongoose schemas (user, product, cart)
│   ├── router/                 # Express routers, split by feature
│   ├── utils/                  # Validation, email, and flash message helpers
│   ├── views/                  # EJS templates
│   │   ├── layouts/           # Main layout templates
│   │   └── partials/          # Reusable view components (navbar, flash alerts)
│   └── public/                 # Static assets (CSS, client JS, images)
└── CHANGES.md                  # Development changelog
