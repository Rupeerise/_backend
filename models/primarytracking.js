const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const primaryTracking = new Schema({
  name: String,
  target: Number,
  current: Number,
  trackingType: {
    type: String,
    enum: ["income", "variable expense", "emi", "loan repayment", "investment"],
    required: true,
  },
});

const PrimaryTracking = mongoose.model("PrimaryTracking", primaryTracking);
module.exports = PrimaryTracking;
