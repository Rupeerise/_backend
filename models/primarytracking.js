const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secondaryTrackingSchema = new Schema({
  name: String,
  target: Number,
  current: Number,
});

const primaryTracking = new Schema({
  name: String,
  target: Number,
  current: Number,
  trackingType: {
    type: String,
    enum: ["income", "variable expense", "constant expense"],
    required: true,
  },
  secondaryTracking: [secondaryTrackingSchema],
});

const PrimaryTracking = mongoose.model("PrimaryTracking", primaryTracking);
module.exports = PrimaryTracking;
