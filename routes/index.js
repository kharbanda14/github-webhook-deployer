var express = require("express");
const auth = require("../app/middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/dashboard");
});

router.use("/auth", require("./auth"));
router.use("/dashboard", auth, require("./dashboard"));
router.use("/webhooks", require("./webhooks"));

module.exports = router;
