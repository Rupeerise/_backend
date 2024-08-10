const express = require("express");
const router = express.Router();
const {
  addLoan,
  updateLoan,
  deleteLoan,
  getLoanArray,
} = require("../controllers/loan");
const wrapasync = require("../utilities/utilities");

//add loan
router.post("/", wrapasync(addLoan));

//update loan
router.put("/:id", wrapasync(updateLoan));

//get all loans
router.get("/", wrapasync(getLoanArray));

//delete loan
router.delete("/:id", wrapasync(deleteLoan));

module.exports = router;
