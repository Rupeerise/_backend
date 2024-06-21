const express = require("express");
const router = express.Router();
const {
  addPayment,
  deletePayment,
  getPaymentArray,
  updatePayment,
} = require("../controllers/payment");

router.post("/", addPayment);

router.delete("/:id", deletePayment);

router.get("/", getPaymentArray);

router.put("/:id", updatePayment);

module.exports = router;
