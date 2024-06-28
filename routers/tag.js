const express = require("express");
const router = express.Router();
const {
  addTag,
  updateTag,
  getTagArray,
  deleteTag,
} = require("../controllers/tag");
const wrapasync = require("../utilities/utilities");

// Add tracking
router.post("/", wrapasync(addTag));

// Update tracking
router.put("/:id", wrapasync(updateTag));

//get tracking array
router.get("/", wrapasync(getTagArray));

router.delete("/:id", wrapasync(deleteTag));

module.exports = router;
