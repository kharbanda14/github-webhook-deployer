const localEnv = {
  APP_NAME: process.env.APP_NAME,
};

module.exports = (req, res, next) => {
  res.locals.env = localEnv;

  res.locals.url = function () {
    return new URL(
      Object.values(arguments).join("/"),
      process.env.SITE_URL
    ).toString();
  };

  res.locals.activeUrl = function (pattern) {
    return new RegExp(pattern.trim(), "i").test(req.originalUrl);
  };

  next();
};
