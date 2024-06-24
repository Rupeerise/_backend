const express = require("express");
const router = express.Router();
const {
  addTarget,
  updateTarget,
  deleteTarget,
} = require("../controllers/target");

// Add target
router.post("/", addTarget);

// Update target
router.put("/", updateTarget);

// Delete target
router.delete("/:id", deleteTarget);

module.exports = router;
