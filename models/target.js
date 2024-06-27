const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const targetSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  tagid: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
});

module.exports = mongoose.model("Target", targetSchema);
