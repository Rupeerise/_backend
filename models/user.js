const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  tagArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  paymentArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  loanArray: [
    {
      type: Schema.Types.ObjectId,
      ref: "Loan",
    },
  ],
  currency: {
    type: String,
    // required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
