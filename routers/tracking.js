const express = require("express");
const router = express.Router();
const { addTracking, updateTracking } = require("../controllers/tracking");

// Add tracking
router.post("/add", addTracking);

// Update tracking
router.put("/:id", updateTracking);

module.exports = router;
