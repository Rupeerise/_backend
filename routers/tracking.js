const express = require("express");
const router = express.Router();
const primaryTracking = require("../models/primarytracking");

// Add tracking
router.post("/add", async (req, res) => {
  if (req.user) {
    let { name, target, trackingType } = req.body;
    let newTracking = new primaryTracking({
      name,
      target,
      trackingType,
      current: 0,
      secondaryTracking: [{ name: "other", target, current: 0 }],
    });
    await newTracking.save();

    req.user.trackingArray.push(newTracking);
    await req.user.save();

    res.json({ message: "Tracking added successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Update tracking
router.put("/:id", async (req, res) => {
  if (req.user) {
    let id = req.params.id;
    let { name, target } = req.body;
    //finding from user's trackingArray
    let update = await primaryTracking.findOne({ _id: id, user: req.user._id });
    update.name = name;
    update.target = target;
    await update.save();
    res.json({ message: "Tracking updated successfully" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
