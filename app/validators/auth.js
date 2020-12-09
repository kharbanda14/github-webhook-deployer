const validate = require("../middlewares/validate");

module.exports.login = validate((joi) =>
  joi.object({
    username: joi.string().required().label("Email"),
    password: joi.string().required().label("Password"),
  })
);
