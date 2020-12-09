const dashboardService = require("../../services/dashboard.service");
const {
  DEPLOYMENT_STATUS_CLASS,
} = require("../../enums/deployment-status.enum");

module.exports.dashboardController = {
  async index(req, res, next) {
    res.render("dashboard/index", {
      totalApps: await dashboardService.getTotalApps(),
      totalDeployments: await dashboardService.getTotalDeployments(),
      totalUsers: await dashboardService.getTotalUsers(),
      recentDeployments: {
        docs: await dashboardService.getRecentDeployments(),
      },
      deploymentStatusClass: DEPLOYMENT_STATUS_CLASS,
    });
  },
};
