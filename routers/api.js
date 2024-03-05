const express = require("express");
const passport = require("passport");
const User = require("../models/user"); // adjust the path to match your file structure
const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
  let { username, fullname, password } = req.body;
  let newUser = new User({ username, fullname });
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
    req.user.markModified("trackingArray");
    await req.user.save();
    const updatedUser = await User.findById(req.user._id)
      .populate("trackingArray")
      .populate({
        path: "paymentArray",
        populate: {
          path: "trackingid",
          model: "PrimaryTracking",
        },
      });
    res.json({
      username: updatedUser.username,
      trackingArray: updatedUser.trackingArray,
      paymentArray: updatedUser.paymentArray,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
