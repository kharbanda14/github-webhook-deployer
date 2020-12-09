module.exports.siteUrl = function () {
  return new URL(
    Object.values(arguments).join("/"),
    process.env.SITE_URL
  ).toString();
};
