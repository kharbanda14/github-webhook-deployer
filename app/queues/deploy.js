const Queue = require("bull");

const { exec } = require("child_process");
const { normalize } = require("path");
const { DEPLOYMENT_STATUS } = require("../enums/deployment-status.enum");
const { siteUrl } = require("../helpers/url");
const { saveActivity } = require("../lib/activity");
const logger = require("../lib/logger");
const Deployments = require("../models/Deployments");
const { dashboardSocket } = require("../websocket/namespaces/dashboard");

const deploymentQueue = new Queue("deployments", process.env.REDIS_URL);

deploymentQueue.process(async (job, done) => {
  const { data: deploymentId } = job;

  const queuedDeployment = await Deployments.findById(deploymentId).populate(
    "appId"
  );

  if (!queuedDeployment) {
    return done();
  }

  const deployApp = await queuedDeployment.appId;

  if (!deployApp._id) {
    await queuedDeployment.failedDeployment("Application not found");
    return done();
  }

  dashboardSocket.sendNotification({
    title: `New Deployment`,
    body: `Started new deployment for ${deployApp.name}`,
    action: siteUrl(
      "dashboard/apps/deployments",
      deployApp._id,
      "view",
      deploymentId
    ),
  });

  await queuedDeployment.deploymentStatus(DEPLOYMENT_STATUS.ACTIVE);

  logger.info(`Deploying ${deployApp.name}`);

  exec(
    deployApp.executeCommand,
    {
      cwd: deployApp.applicationDirectory,
      env: process.env,
    },
    async (err, stdOut, stdErr) => {
      if (err) {
        logger.error(err);
        await queuedDeployment.failedDeployment(stdErr);
        dashboardSocket.sendNotification({
          title: `Deployment Failed`,
          body: `Deployment for ${deployApp.name} was failed`,
          action: siteUrl(
            "dashboard/apps/deployments",
            deployApp._id,
            "view",
            deploymentId
          ),
        });
        return done(err);
      }

      logger.info(`Deployment Complete ${deployApp.name}`);
      logger.info(stdOut);
      logger.error(stdErr);
      await queuedDeployment.successDeployment(stdOut);
      await saveActivity("app.deployed", deployApp, queuedDeployment);
      dashboardSocket.sendNotification({
        title: `Deployment Complete`,
        body: `Deployment for ${deployApp.name} was completed`,
        action: siteUrl(
          "dashboard/apps/deployments",
          deployApp._id,
          "view",
          deploymentId
        ),
      });
    }
  );

  return done();
});

module.exports = deploymentQueue;
