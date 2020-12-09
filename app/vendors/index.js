const { WEBHOOK_VENDORS } = require("../enums/webhook-vendors.enum");

module.exports = {
  [WEBHOOK_VENDORS.GITHUB]: require("./github"),
};
