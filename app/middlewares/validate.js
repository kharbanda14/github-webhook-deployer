const joi = require("joi");

module.exports = (callable) => {
  return async (req, res, next) => {
    try {
      const sanitizedData = await callable(joi).validateAsync(req.body);
      req.body = sanitizedData;
      next();
    } catch (error) {
      const formattedError = {};

      if (error.details) {
        error.details.forEach((err) => {
          formattedError[err.context.key] = err.message;
        });

        req.flash("validation_errors", formattedError);

        return res.redirect("back");
      }

      return next(error);
    }
  };
};
