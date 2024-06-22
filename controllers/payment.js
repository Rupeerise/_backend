const Payment = require("../models/payment");
const Tag = require("../models/tag");
const User = require("../models/user");

const addPayment = async (req, res) => {
  if (req.user) {
    let { _id, amount, date } = req.body;
    if (!date) date = new Date();
    // Populate the trackingArray
    await req.user.populate("tagArray");
    let newPayment = new Payment({
      tagid: _id,
      amount,
      date,
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
  const { amount, date } = req.body;
  const updatePayment = await Payment.findById(paymentId);
  const tagid = updatePayment.tagid;
  const updateTag = await Tag.findById(tagid);
  updatePayment.amount = amount;
  updatePayment.date = date;
  await updatePayment.save();
  await updateTag.save();
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
