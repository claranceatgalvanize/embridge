const passport = require("passport"),
  { Strategy } = require("passport-local"),
  mongoose = require("mongoose");

const User = mongoose.model("User");
