const { string } = require("joi");
const Payment = require("../models/payment");
const Tag = require("../models/tag");
const User = require("../models/user");
const paymentSchema = require("../schema/payment");

const addPayment = async (req, res) => {
  if (req.user) {
    let { _id, amount, date, paymentType, isDone } = req.body;
    if (!date) date = new Date();
    // Populate the trackingArray
    const { error } = paymentSchema.validate({
      tagid: _id,
      amount,
      date,
      paymentType,
      isDone,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    await req.user.populate("tagArray");
    let newPayment = new Payment({
      tagid: _id,
      amount,
      date,
      paymentType,
      isDone,
    });
    await newPayment.save();
    req.user.paymentArray.push(newPayment);
    await req.user.save();
    await newPayment.populate("tagid");
    res.json({ newPayment });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deletePayment = async (req, res) => {
  const paymentId = req.params.id;
  const updatePayment = await Payment.findById(paymentId);
  const tagid = updatePayment.tagid;
  await Payment.findByIdAndDelete(paymentId);
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { paymentArray: paymentId },
  });
  res.json({ message: "Payment deleted successfully" });
};

const updatePayment = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const paymentId = req.params.id;
  let { amount, date, isDone, paymentType, tagid } = req.body;
  if (!date) date = new Date();
  if (!isDone) isDone = true;
  const updatePayment = await Payment.findById(paymentId);

  const { error } = paymentSchema.validate({
    tagid: "tag id ",
    amount,
    date,
    paymentType,
    isDone,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  // Update the payment
  updatePayment.amount = amount;
  updatePayment.date = date;
  updatePayment.isDone = isDone;
  updatePayment.paymentType = paymentType;
  updatePayment.tagid = tagid;

  await updatePayment.save();
  await updatePayment.populate("tagid");
  res.json({ updatePayment });
};

const getPaymentArray = async (req, res) => {
  if (req.user) {
    await req.user.populate({
      path: "paymentArray",
      populate: {
        path: "tagid",
        model: "Tag",
      },
    });
    res.json(req.user.paymentArray);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = { addPayment, deletePayment, getPaymentArray, updatePayment };
