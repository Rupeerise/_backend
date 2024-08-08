const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  tagid: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
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

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
