const authenticateroute = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};
