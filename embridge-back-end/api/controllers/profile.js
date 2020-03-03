const mongoose = require("mongoose"),
  User = mongoose.model("User");

module.exports.profileRead = (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      "message:": "UnauthorizedError : private profile"
    });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      res.status(200).json(user);
    });
  }
};
