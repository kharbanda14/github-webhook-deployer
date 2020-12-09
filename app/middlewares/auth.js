module.exports = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Login Required");
    req.flash("login_redirect", req.originalUrl);
    return res.redirect("/auth/login");
  }
  res.locals.user = req.user;
  next();
};
