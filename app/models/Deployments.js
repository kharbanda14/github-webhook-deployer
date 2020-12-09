const { model, Schema } = require("mongoose");
const moment = require("moment");
const { DEPLOYMENT_STATUS } = require("../enums/deployment-status.enum");

const deploymentSchema = new Schema(
  {
    appId: {
      type: Schema.Types.ObjectId,
      ref: "app",
    },
    ref: String,
    hookId: String,
    sender: {
      login: String,
      avatar_url: String,
      html_url: String,
    },
    head_commit: {
      id: String,
      message: String,
      timestamp: Date,
      url: String,
      author: Object,
    },
    body: Object,
    deploymentError: String,
    deploymentResponse: String,
    status: {
      type: String,
      enum: DEPLOYMENT_STATUS.all(),
      default: DEPLOYMENT_STATUS.QUEUED,
    },
  },
  { timestamps: true }
);

deploymentSchema.virtual("lastDeploy").get(function () {
  return moment(this.createdAt).fromNow();
});
deploymentSchema.virtual("shortCommitId").get(function () {
  return this.head_commit.id.substr(0, 8);
});

deploymentSchema.method("failedDeployment", async function (error) {
  this.status = DEPLOYMENT_STATUS.FAILED;
  this.deploymentError = error;
  await this.save();

  const app = await this.application();
  app.deployments.failure += 1;
  await app.save();
});
deploymentSchema.method("successDeployment", async function (successResponse) {
  this.status = DEPLOYMENT_STATUS.COMPLETED;
  this.deploymentResponse = successResponse;
  await this.save();

  const app = await this.application();
  app.deployments.success += 1;
  app.deployments.recentDeployment = new Date();
  await app.save();
});

deploymentSchema.method("application", async function () {
  return await model("app").findById(this.appId);
});

deploymentSchema.method("deploymentStatus", async function (status) {
  this.status = status;
  await this.save();
});

module.exports = model("app_deployments", deploymentSchema);
