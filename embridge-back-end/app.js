const express = require("express"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  passport = require("passport");

require("./api/models/db");
require("./api/config/passport");

const routesApi = require("./api/routes/index"),
  app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use("/api", routesApi);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: `${err.name}: ${err.message}` });
  }
});

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json("error", {
      message: err.message,
      error: err
    });
  });
}

app.listen(4200, () => {
  console.log("listening on port 4200");
});

module.exports = app;
