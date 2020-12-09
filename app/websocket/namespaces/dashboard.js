const { webSocket } = require("..");
const { webSocketAuth } = require("../middleware");

const dashboardNs = webSocket.of("/dashboard");

dashboardNs.use(webSocketAuth);

dashboardNs.on("connection", (socket) => {
  //
});

module.exports.dashboardSocket = {
  sendNotification({ title, body, action }) {
    dashboardNs.emit("notification", {
      title,
      body,
      action,
    });
  },
  sendLiveActivity(data) {
    dashboardNs.emit("activity", data);
  },
};
