const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loan = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  tagType: {
    type: String,
    enum: ["emi", "loan", "investment"],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Loan = mongoose.model("Loan", loan);
module.exports = Loan;
