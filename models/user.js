const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const primaryTracking = require("./primarytracking");
const payment = require("./payment");

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  trackingArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "PrimaryTracking",
    },
  ],
  paymentArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;