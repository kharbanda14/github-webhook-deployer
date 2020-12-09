var express = require("express");
const activity = require("../../app/controllers/dashboard/activity.controller");

var router = express.Router();

router.get("/", activity.index);
router.get("/recent", activity.recentActivity);

module.exports = router;
