const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  tagid: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
    default: null,
    set: (v) => (v === "" ? null : v),
  },
  loanid: {
    type: Schema.Types.ObjectId,
    ref: "Loan",
    default: null,
    set: (v) => (v === "" ? null : v),
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
    enum: ["paid", "received"],
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

// Add a custom validator to check that either tagid or loanid is set, but not both
paymentSchema.pre("validate", function (next) {
  if ((this.tagid && this.loanid) || (!this.tagid && !this.loanid)) {
    next(
      new Error(
        "Payment must have either a tagid or a loanid, but not both or neither."
      )
    );
  } else {
    next();
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
