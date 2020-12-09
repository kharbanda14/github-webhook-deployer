var createError = require("http-errors");
const appLogger = require("./app/lib/logger");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
require("express-async-errors");

const expressSession = require("express-session");
const connectMongo = require("connect-mongo")(expressSession);

require("dotenv").config();

const db = require("./app/db");

const passport = require("./app/config/passport");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

if (process.env.NODE_ENV != "production") {
  let logger = require("morgan");
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new connectMongo({ mongooseConnection: db.connection }),
  })
);

app.use(require("connect-flash")());

app.use(require("./app/middlewares/flash"));
app.use(require("./app/middlewares/locals"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  appLogger.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
