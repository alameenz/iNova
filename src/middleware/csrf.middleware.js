import crypto from "crypto";

// Generates one token per session and exposes it to every view as csrfToken.
export function attachCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

// Rejects state-changing requests (POST/PUT/PATCH/DELETE) whose body doesn't
// carry a matching _csrf token. Safe methods are left untouched.
export function verifyCsrfToken(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const tokenFromRequest = req.body?._csrf;
  const tokenFromSession = req.session?.csrfToken;

  if (
    !tokenFromRequest ||
    !tokenFromSession ||
    tokenFromRequest !== tokenFromSession
  ) {
    req.flash("error", "Your form session expired. Please try again.");
    const fallback = req.get("Referer") || "/";
    return res.redirect(fallback);
  }

  next();
}
