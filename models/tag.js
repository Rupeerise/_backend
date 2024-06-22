const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tag = new Schema({
  name: String,
  target: [
    {
      month: Number,
      year: Number,
      amount: Number,
    },
  ],
  tagType: {
    type: String,
    enum: ["income", "variable expense", "emi", "loan repayment", "investment"],
    required: true,
  },
});

const Tag = mongoose.model("Tag", tag);
module.exports = Tag;
