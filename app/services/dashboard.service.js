const Apps = require("../models/Apps");
const Deployments = require("../models/Deployments");
const { DEPLOYMENT_STATUS } = require("../enums/deployment-status.enum");
const User = require("../models/User");

module.exports = {
  async getTotalApps() {
    return await Apps.find().countDocuments();
  },
  async getTotalDeployments() {
    return await Deployments.find({
      status: DEPLOYMENT_STATUS.COMPLETED,
    }).countDocuments();
  },
  async getRecentDeployments() {
    return await Deployments.find({
      status: DEPLOYMENT_STATUS.COMPLETED,
    })
      .limit(5)
      .sort({ _id: -1 });
  },
  async getTotalUsers() {
    return await User.find().countDocuments();
  },
};
