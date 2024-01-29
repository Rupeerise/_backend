const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const primaryTracking = new Schema({
  name: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
});

const PrimaryTracking = mongoose.model("PrimaryTracking", primaryTracking);
module.exports = PrimaryTracking;
