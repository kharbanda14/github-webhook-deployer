const io = require("socket.io")();

io.on("connection", (socket) => {
  console.log(socket.id, "Connected");
});

module.exports.webSocket = io;

module.exports.init = () => {
  require("./namespaces");
};
