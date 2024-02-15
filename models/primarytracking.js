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
  secondaryTracking: [secondaryTrackingSchema],
});

const PrimaryTracking = mongoose.model("PrimaryTracking", primaryTracking);
module.exports = PrimaryTracking;
