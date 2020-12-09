module.exports = (req, res, next) => {
  res.locals.flash_error = req.flash("error");
  res.locals.flash_success = req.flash("success");
  res.locals.flash_info = req.flash("info");
  res.locals.flash_warning = req.flash("warning");
  res.locals.validation_errors = req.flash("validation_errors");

  res.locals.validation_errors = res.locals.validation_errors.length
    ? res.locals.validation_errors[0]
    : {};

  next();
};
