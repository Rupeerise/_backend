const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const primaryTracking = require("../models/primarytracking");
const User = require("../models/user");

router.post("/add", async (req, res) => {
  if (req.user) {
    let { name, amount, date } = req.body;

    // Populate the trackingArray
    await req.user.populate("trackingArray");

    let trackingid = req.user.trackingArray.find(
      (tracking) => tracking.name === name
    );

    if (trackingid) {
      trackingid.current = Number(trackingid.current) + Number(amount);
      await trackingid.save();
      let newPayment = new Payment({
        trackingid: trackingid._id,
        amount,
        date,
      });
      await newPayment.save();
      req.user.paymentArray.push(newPayment);
      await req.user.save();
      res.json({ message: "Payment added successfully" });
    } else {
      res.status(404).json({ message: "Tracking not found" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.delete("/:id", async (req, res) => {
  const paymentId = req.params.id;
  const updatePayment = await Payment.findById(paymentId);
  const trackingid = updatePayment.trackingid;
  const updateTracking = await primaryTracking.findById(trackingid);
  updateTracking.current = updateTracking.current - updatePayment.amount;
  await updateTracking.save();
  await Payment.findByIdAndDelete(paymentId);
  // Remove the payment from user's paymentArray
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { paymentArray: paymentId },
  });
  res.json({ message: "Payment deleted successfully" });
});

module.exports = router;
