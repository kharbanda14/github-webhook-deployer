var express = require("express");
const passport = require("../app/config/passport");
const auth = require("../app/middlewares/auth");
const validate = require("../app/middlewares/validate");
const { login } = require("../app/validators/auth");

var router = express.Router();

/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

router.get("/profile", auth, (req, res) => {
  return res.send(req.user);
});

router.post(
  "/login",
  login,
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  (req, res) => {
    const intendedRedirect = req.flash("login_redirect");
    res.redirect(intendedRedirect.length ? intendedRedirect[0] : "/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout();

  return res.redirect("/auth/login");
});

module.exports = router;
