const primaryTracking = require("../models/primarytracking");

const addTracking = async (req, res) => {
  if (req.user) {
    let { name, target, trackingType } = req.body;
    let newTracking = new primaryTracking({
      name,
      target,
      trackingType,
      current: 0,
    });
    await newTracking.save();
    req.user.trackingArray.push(newTracking);
    await req.user.save();

    res.json({ message: "Tracking added successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const updateTracking = async (req, res) => {
  if (req.user) {
    let id = req.params.id;
    let { name, target } = req.body;
    let update = await primaryTracking.findOne({ _id: id, user: req.user._id });
    update.name = name;
    update.target = target;
    await update.save();
    res.json({ message: "Tracking updated successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = {
  addTracking,
  updateTracking,
};
