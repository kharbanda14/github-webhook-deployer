const User = require("../models/User");

module.exports.webSocketAuth = async (socket, next) => {
  const { token } = socket.handshake.query;

  if (!token) return next(new Error({ message: "Access Denied" }));

  const user = await User.findOne({ token }, { name: 1, _id: 1 });

  if (!user) return next(new Error({ message: "Access Denied" }));

  socket.request.user = user;

  next();
};
