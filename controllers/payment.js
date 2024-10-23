const { string } = require("joi");
const Payment = require("../models/payment");
const Tag = require("../models/tag");
const User = require("../models/user");
const paymentSchema = require("../schema/payment");

const addPayment = async (req, res) => {
  if (req.user) {
    let { tagid, loanid, amount, date, paymentType, isDone } = req.body;
    if (!date) date = new Date();
    // Populate the trackingArray
    const { error } = paymentSchema.validate({
      tagid,
      loanid,
      amount,
      date,
      paymentType,
      isDone,
    });
    if (error) {
      // console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
    await req.user.populate("tagArray");
    let newPayment = new Payment({
      tagid,
      loanid,
      amount,
      date,
      paymentType,
      isDone,
    });
    // console.log(newPayment);
    await newPayment.save();
    req.user.paymentArray.push(newPayment);
    await req.user.save();
    await newPayment.populate("tagid");
    await newPayment.populate("loanid");
    res.json({ newPayment });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deletePayment = async (req, res) => {
  const paymentId = req.params.id;
  await Payment.findByIdAndDelete(paymentId);
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { paymentArray: paymentId },
  });
  res.json({ message: "Payment deleted successfully" });
};

const updatePayment = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const paymentId = req.params.id;
  let { amount, date, isDone, paymentType, tagid, loanid } = req.body;
  if (!date) date = new Date();
  if (!isDone) isDone = true;
  const updatePayment = await Payment.findById(paymentId);

  // Update the payment
  updatePayment.amount = amount;
  updatePayment.date = date;
  updatePayment.isDone = isDone;
  updatePayment.paymentType = paymentType;
  updatePayment.tagid = tagid;
  updatePayment.loanid = loanid;

  const { error } = paymentSchema.validate({
    tagid,
    loanid,
    amount,
    date,
    paymentType,
    isDone,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  await updatePayment.save();
  await updatePayment.populate("tagid");
  await updatePayment.populate("loanid");
  res.json({ updatePayment });
};

const getPaymentArray = async (req, res) => {
  if (req.user) {
    await req.user.populate({
      path: "paymentArray",
      populate: [
        {
          path: "tagid",
          model: "Tag",
        },
        {
          path: "loanid",
          model: "Loan",
        },
      ],
    });
    res.json(req.user.paymentArray);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = { addPayment, deletePayment, getPaymentArray, updatePayment };
