const express = require("express");
const router = express.Router();
const { addPayment, deletePayment } = require("../controllers/payment");

router.post("/add", addPayment);

router.delete("/:id", deletePayment);

module.exports = router;
