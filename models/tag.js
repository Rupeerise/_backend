const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tag = new Schema({
  name: String,
  targets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Target",
    },
  ],
  tagType: {
    type: String,
    enum: ["income", "variable expense"],
    required: true,
  },
  timePeriod: {
    type: String,
    required: false,
  },
});

const Tag = mongoose.model("Tag", tag);
module.exports = Tag;
