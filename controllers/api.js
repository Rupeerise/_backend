const passport = require("passport");
const User = require("../models/user");

// signup
const signup = async (req, res) => {
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
};

// logout
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "User logged out successfully" });
    }
  });
};

//user
const user = async (req, res) => {
  if (req.user) {
    res.json({
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

// authenticate
const authenticate = async (req, res) => {
  if (req.user) {
    res.json({
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

//get currency
const currency = async (req, res) => {
  if (req.user) {
    res.json({
      currency: req.user.currency,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

//update currency
const updateCurrency = async (req, res) => {
  if (req.user) {
    const { currency } = req.body;
    req.user.currency = currency;
    await req.user.save();
    res.json({ currency: req.user.currency });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = {
  signup,
  logout,
  user,
  authenticate,
  currency,
  updateCurrency,
};
