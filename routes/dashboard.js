var express = require("express");
const {
  dashboardController,
} = require("../app/controllers/dashboard/index.controller");

var router = express.Router();

/* GET users listing. */
router.get("/", dashboardController.index);

router.use("/apps", require("./dashboard/apps"));
router.use("/activity", require("./dashboard/activity"));

module.exports = router;
