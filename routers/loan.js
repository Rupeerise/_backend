const express = require("express");
const router = express.Router();
const wrapasync = require("../utilities/utilities");
const {
  addLoan,
  updateLoan,
  deleteLoan,
  getLoanArray,
} = require("../controllers/loan");

//add loan
router.post("/", wrapasync(addLoan));

//update loan
router.put("/:id", wrapasync(updateLoan));

//delete loan
router.delete("/:id", wrapasync(deleteLoan));

//get all loans
router.get("/", wrapasync(getLoanArray));

module.exports = router;
