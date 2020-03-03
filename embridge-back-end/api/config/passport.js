const passport = require("passport"),
  { Strategy } = require("passport-local"),
  mongoose = require("mongoose");

const User = mongoose.model("User");

passport.use(
  new Strategy(
    {
      usernameField: "email"
    },
    (username, password, done) => {
      User.findOne({ email, username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "User not found" });
        if (!user.validPassword(password))
          return done(null, false, { message: "Incorrect password" });
        return done(null, user);
      });
    }
  )
);
