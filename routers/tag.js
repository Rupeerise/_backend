const express = require("express");
const router = express.Router();
const { addTag, updateTag, getTagArray } = require("../controllers/tag");

// Add tracking
router.post("/", addTag);

// Update tracking
router.put("/:id", updateTag);

//get tracking array
router.get("/", getTagArray);

module.exports = router;
