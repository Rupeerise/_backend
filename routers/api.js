const express = require("express");
const passport = require("passport");
const User = require("../models/user"); // adjust the path to match your file structure
const router = express.Router();
const {
  signup,
  logout,
  user,
  authenticate,
  currency,
} = require("../controllers/api");
const wrapasync = require("../utilities/utilities");

//signup
router.post("/signup", wrapasync(signup));

//login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user.username });
});

//logout
router.post("/logout", wrapasync(logout));

//user
router.get("/user", wrapasync(user));

router.put("/authenticate", wrapasync(authenticate));

router.get("/currency", wrapasync(currency));

router.put("/currency", wrapasync(currency));

module.exports = router;
