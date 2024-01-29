const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const primaryTracking = require("./primarytracking");

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  trackingArray: [primaryTracking.schema],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
