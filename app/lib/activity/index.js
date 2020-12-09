const Activity = require("../../models/Activity");
const { dashboardSocket } = require("../../websocket/namespaces/dashboard");
const logger = require("../logger");

const activityEvents = {
  "app.created": require("./events/app.created"),
  "app.deployed": require("./events/app.deployed"),
  "app.status.changed": require("./events/app-status-changed"),
};

module.exports.saveActivity = async (eventName, ...params) => {
  if (activityEvents[eventName]) {
    try {
      const formatted = activityEvents[eventName].apply(this, params);
      let activityDoc = new Activity(formatted);
      await activityDoc.save();
      dashboardSocket.sendLiveActivity(activityDoc);
    } catch (error) {
      logger.error(error);
    }
  }
};
