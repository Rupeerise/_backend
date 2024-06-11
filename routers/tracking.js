const express = require("express");
const router = express.Router();
const {
  addTracking,
  updateTracking,
  getTrackingArray,
} = require("../controllers/tracking");

// Add tracking
router.post("/add", addTracking);

// Update tracking
router.put("/:id", updateTracking);

//get tracking array
router.get("/", getTrackingArray);

module.exports = router;
