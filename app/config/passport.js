const passport = require("passport");
const { Strategy } = require("passport-local");
const bcryptjs = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new Strategy(
    { passReqToCallback: true },
    async (req, username, password, cb) => {
      const user = await User.findOne({ email: username });

      if (!user) {
        req.flash("error", "Invalid Credentials");
        return cb(null, false);
      }

      const valid = bcryptjs.compareSync(password, user.password);

      if (!valid) {
        req.flash("error", "Invalid Credentials");
        return cb(null, false);
      }

      return cb(null, user);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  await User.findById(id, "-password", function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

module.exports = passport;
