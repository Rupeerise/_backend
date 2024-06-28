const express = require("express");
const router = express.Router();
const {
  addTarget,
  updateTarget,
  deleteTarget,
} = require("../controllers/target");
const wrapasync = require("../utilities/utilities");

// Add target
router.post("/", wrapasync(addTarget));

// Update target
router.put("/", wrapasync(updateTarget));

// Delete target
router.delete("/:id", wrapasync(deleteTarget));

module.exports = router;
