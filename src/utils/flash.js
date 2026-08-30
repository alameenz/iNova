export function handleError(res, statusCode, message) {
  res.status(statusCode);
  res.locals.messages = { error: [message] };
}

export function showFlashAndRedirect(req, res, type, message, redirectUrl) {
  req.flash(type, message);
  req.redirect(redirectUrl);
}
