const express = require("express");
const passport = require("passport");
const User = require("../models/user"); // adjust the path to match your file structure
const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
  let { username, password, currency } = req.body;
  let newUser = new User({ username, currency });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error logging in user" });
    } else {
      res.json({ message: "User created and logged in successfully" });
    }
  });
});

//login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user.username });
});

//logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "User logged out successfully" });
    }
  });
});

//user
router.get("/user", async (req, res) => {
  if (req.user) {
    res.json({
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.put("/authenticate", async (req, res) => {
  if (req.user) {
    res.json({
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/currency", async (req, res) => {
  if (req.user) {
    res.json({
      currency: req.user.currency,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.put("/currency", async (req, res) => {
  if (req.user) {
    let { currency } = req.body;
    await User.findByIdAndUpdate(req.user._id, { currency });
    res.json({
      currency,
    });
  }
});

module.exports = router;
