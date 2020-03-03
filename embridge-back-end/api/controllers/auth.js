const passport = require("passport"),
  mongoose = require("mongoose"),
  User = mongoose.model("User");

module.exports.register = (req, res) => {
  const user = new User(),
    { name, email, password } = req.body;

  user.name = name;
  user.email = email;

  user.setPassword(password);
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
    let token;
    if (err) {
      res.status(404).json(err);
      return;
    }
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
