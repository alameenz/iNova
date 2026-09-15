import express from "express";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import expressLayouts from "express-ejs-layouts";
import authRouter from "./src/router/auth.routes.js";
import productRouter from "./src/router/product.routes.js";
import sellerRouter from "./src/router/seller.routes.js";
import cartRouter from "./src/router/cart.routes.js";
import { connectDB } from "./src/config/db.js";
import {
  attachCsrfToken,
  verifyCsrfToken,
} from "./src/middleware/csrf.middleware.js";

// Check if required env variables exist
if (!process.env.SESSION_SECRET) {
  console.error("❌ ERROR: SESSION_SECRET not found in .env file");
  process.exit(1); // Stop the app
}

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not found in .env file");
  process.exit(1);
}

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));

// Static assets don't need session/flash/csrf work done on them.
app.use(express.static(path.join(process.cwd(), "src", "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    warning: req.flash("warning"),
  };
  next();
});

// Issues a per-session CSRF token and makes it available to every view
// as `csrfToken`, then rejects unsafe requests that don't carry it back.
app.use(attachCsrfToken);
app.use(verifyCsrfToken);

app.use(authRouter);
app.use(productRouter);
app.use(sellerRouter);
app.use(cartRouter);

// 404 handler - anything that didn't match a route above
app.use((req, res) => {
  res.status(404).render("404");
});

// Global error handler - catches anything thrown/rejected in route handlers
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("500");
});

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
