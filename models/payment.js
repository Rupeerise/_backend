const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  tagid: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  loanid: {
    type: Schema.Types.ObjectId,
    ref: "Loan",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

// Custom validation to ensure either tagid or loanid is present
paymentSchema.path("tagid").validate(function (value) {
  return this.tagid || this.loanid;
}, "Either tagid or loanid must be present.");

paymentSchema.path("loanid").validate(function (value) {
  return this.tagid || this.loanid;
}, "Either tagid or loanid must be present.");

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
