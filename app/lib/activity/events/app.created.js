const { siteUrl } = require("../../../helpers/url");

module.exports = (user, app) => {
  return {
    title: `Created new app ${app.name}`,
    user: { name: user.name },
    action: siteUrl("dashboard/apps/deployments", app._id),
  };
};
