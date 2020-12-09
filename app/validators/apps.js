const { APPS_CATEGORY } = require("../enums/app-category.enum");
const validate = require("../middlewares/validate");

module.exports.createApp = validate((joi) =>
  joi.object({
    name: joi.string().required(),
    description: joi.string(),
    webhookSecret: joi.string().required(),
    category: joi
      .string()
      .required()
      .valid(...APPS_CATEGORY.all()),
    applicationDirectory: joi.string().required(),
    executeCommand: joi.string().required(),
    targetBranch: joi.string().required(),
  })
);
