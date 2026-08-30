# iNova

iNova is a Node.js e-commerce web application built with an MVC architecture. It supports user authentication, seller onboarding (with email OTP verification), and product listing/management. Built with Express, MongoDB (Mongoose), and EJS templates.

## Features

- **User authentication** — signup, login, logout with hashed passwords (bcrypt) and session-based auth
- **Become a seller** — users can upgrade their account to a seller role via email OTP verification
- **Seller dashboard** — sellers can add, edit, and delete their own product listings
- **Product catalog** — browse products on the home page and view individual product details
- **Flash messages** — success/error/warning feedback across the app using `connect-flash`

> **Note:** The shopping cart feature is scaffolded (data model in place) but not yet functional — cart routes/controller are still to be implemented.

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Templating:** EJS with `express-ejs-layouts`
- **Auth & Sessions:** `express-session`, `bcrypt`
- **Email:** Nodemailer (for OTP delivery)
- **Styling:** Bootstrap 5 + custom CSS

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- An email account (e.g. Gmail) for sending OTP emails via Nodemailer

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/alameenz/iNova.git
cd iNova
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following:

```env
SESSION_SECRET=your_session_secret_here
MONGO_URI=mongodb://localhost:27017/inova

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

> `EMAIL_PASS` should be an [app password](https://support.google.com/accounts/answer/185833), not your regular email password, if using Gmail.

### 4. Run the app

```bash
node server.js
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

iNova/
├── server.js # App entry point
├── src/
│ ├── config/ # Database connection
│ ├── controller/ # Route handlers (auth, product, seller, cart)
│ ├── middleware/ # Auth middleware
│ ├── model/ # Mongoose schemas (user, product, cart)
│ ├── router/ # Express route definitions
│ ├── utils/ # Validation, flash messages, email helpers
│ ├── public/ # Static CSS/JS assets
│ └── views/ # EJS templates and layouts


## License

ISC
