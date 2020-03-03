const jwt = require("express-jwt"),
  express = require("express");

const router = express.Router(),
  auth = jwt({
    secret: "MY_SECRET",
    userProperty: "payload"
  });

const ctrlProfile = require("../controllers/profile"),
  ctrlAuth = require("../controllers/auth");

router.get("/profile", auth, ctrlProfile.profileRead);

router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

module.exports = router;
