const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const primaryTracking = require("./primarytracking");

const paymentSchema = new Schema({
  trackingid: {
    type: Schema.Types.ObjectId,
    ref: "PrimaryTracking",
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
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;