const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports.register = (req, res) => {
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save(err => {
    let token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      token: token
    });
  });
};

module.exports.login = (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};
