const express = require("express");
const router = express.Router();
const {
  addPayment,
  deletePayment,
  getPaymentArray,
} = require("../controllers/payment");

router.post("/add", addPayment);

router.delete("/:id", deletePayment);

router.get("/", getPaymentArray);

module.exports = router;
