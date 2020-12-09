const { APP_STATUS_LABEL } = require("../../../enums/app-status.enum");
const { siteUrl } = require("../../../helpers/url");

module.exports = (user, app) => {
  return {
    title: `${APP_STATUS_LABEL[app.status]} ${app.name}`,
    user: { name: user.name },
    action: siteUrl("dashboard/apps/deployments", app._id),
  };
};
