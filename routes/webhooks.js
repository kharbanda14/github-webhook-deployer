var express = require("express");
const Apps = require("../app/models/Apps");
const logger = require("../app/lib/logger");
const { WEBHOOK_VENDORS } = require("../app/enums/webhook-vendors.enum");
const vendors = require("../app/vendors");
const deploy = require("../app/queues/deploy");
const { APP_STATUS } = require("../app/enums/app-status.enum");

var router = express.Router();

router.post("/:slug", async function (req, res, next) {
  const app = await Apps.findOne({
    slug: req.params.slug,
    status: APP_STATUS.ACTIVE,
  });

  if (!app) {
    return res.status(404).json({ message: "App not found" });
  }

  const body = req.body;
  const headers = req.headers;
  const vendorType = WEBHOOK_VENDORS.GITHUB;
  const webhookHandler = vendors[vendorType];

  try {
    if (await webhookHandler.verify(app, body, headers)) {
      const deployment = await app.addDeployment(
        webhookHandler.toDeployment(body, headers)
      );
      deploy.add(deployment._id);
      return res.json({ message: "Deployment Queued" });
    }
    logger.info("No deployment received");
    return res.send({ message: "No deployment received" });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: "Error in processing request" });
  }
});

module.exports = router;
