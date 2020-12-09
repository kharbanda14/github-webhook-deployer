var express = require("express");

const { createApp } = require("../../app/validators/apps");

const {
  appController,
} = require("../../app/controllers/dashboard/app.controller");

var router = express.Router();

router.get("/", appController.index);
router.get("/category/:category", appController.index);
router.get("/create", appController.create);
router.get("/edit/:id", appController.edit);
router.delete("/delete/:id", appController.deleteApp);
router.put("/app-state/:id", appController.toggleAppState);
router.get("/deployments/:id", appController.listAppDeployments);
router.get("/deployments/:id/view/:deployment", appController.viewDeployment);

router.post("/edit/:id", createApp, appController.updateApp);
router.post("/create", createApp, appController.createApp);

module.exports = router;
