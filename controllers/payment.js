const Payment = require("../models/payment");
const Tag = require("../models/tag");
const User = require("../models/user");

const addPayment = async (req, res) => {
  if (req.user) {
    let { _id, amount, date } = req.body;
    if (!date) date = new Date();
    // Populate the trackingArray
    await req.user.populate("tagArray");
    let tagid = req.user.tagArray.find((tag) => tag._id.equals(_id));

    if (tagid) {
      tagid.current = Number(tagid.current) + Number(amount);
      await tagid.save();
      let newPayment = new Payment({
        tagid: tagid._id,
        amount,
        date,
      });
      await newPayment.save();
      req.user.paymentArray.push(newPayment);
      await req.user.save();
      await newPayment.populate("tagid");
      res.json({ newPayment });
    } else {
      res.status(404).json({ message: "Tracking not found" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deletePayment = async (req, res) => {
  const paymentId = req.params.id;
  const updatePayment = await Payment.findById(paymentId);
  const tagid = updatePayment.tagid;
  const updateTag = await Tag.findById(tagid);
  updateTag.current = updateTag.current - updatePayment.amount;
  await updateTag.save();
  await Payment.findByIdAndDelete(paymentId);
  // Remove the payment from user's paymentArray
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
  updateTag.current = updateTag.current - updatePayment.amount;
  updatePayment.amount = amount;
  updatePayment.date = date;
  updateTag.current = updateTag.current + amount;
  await updatePayment.save();
  await updateTag.save();
  res.json({ message: "Payment updated successfully" });
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
