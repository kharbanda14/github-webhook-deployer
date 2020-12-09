const { siteUrl } = require("../../../helpers/url");

module.exports = (app, deployment) => {
  return {
    title: `New Deployment for ${app.name}`,
    user: {
      name: deployment.sender.login,
      avatar: deployment.sender.avatar_url,
    },
    action: siteUrl(
      "dashboard/apps/deployments",
      app._id,
      "view",
      deployment._id
    ),
  };
};
