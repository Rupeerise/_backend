const express = require("express");
const router = express.Router();
const {
  addPayment,
  deletePayment,
  getPaymentArray,
  updatePayment,
} = require("../controllers/payment");
const wrapasync = require("../utilities/utilities");

// Add payment
router.post("/", wrapasync(addPayment));

// Delete payment
router.delete("/:id", wrapasync(deletePayment));

// Get payment array
router.get("/", wrapasync(getPaymentArray));

// Update payment
router.put("/:id", wrapasync(updatePayment));

module.exports = router;
