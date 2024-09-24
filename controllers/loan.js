const Loan = require("../models/loan");
const loanSchema = require("../schema/loan");
const Payment = require("../models/payment");
const paymentSchema = require("../schema/payment");

const addLoan = async (req, res) => {
  // console.log(req.user);
  if (req.user) {
    let { name, amount, interestRate, timePeriod, tagType, color } = req.body;
    const { error } = loanSchema.validate({
      name,
      amount,
      interestRate,
      timePeriod,
      tagType,
      color,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    let newLoan = new Loan({
      name,
      amount,
      interestRate,
      timePeriod,
      tagType,
      color,
    });
    await newLoan.save();
    // console.log(newLoan);
    req.user.loanArray.push(newLoan);
    await req.user.save();
    if (tagType === "loan") {
      let newPayment = new Payment({
        amount: amount,
        date: new Date(),
        tagType: "loan",
        loanid: newLoan._id,
        paymentType: "credit",
      });
      await newPayment.save();
      req.user.paymentArray.push(newPayment);
      await req.user.save();
      res.json({ newLoan, newPayment });
    } else {
      res.json({ newLoan });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const updateLoan = async (req, res) => {
  if (req.user) {
    let { name, amount, interestRate, timePeriod, tagType } = req.body;
    const { error } = loanSchema.validate({
      name,
      amount,
      interestRate,
      timePeriod,
      tagType,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    loan.name = name;
    loan.amount = amount;
    loan.interestRate = interestRate;
    loan.timePeriod = timePeriod;
    loan.tagType = tagType;
    await loan.save();
    res.json({ loan });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const deleteLoan = async (req, res) => {
  if (req.user) {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    await Loan.findByIdAndDelete(req.params.id);
    req.user.loanArray = req.user.loanArray.filter(
      (loan) => loan._id.toString() !== req.params.id
    );
    await req.user.save();
    res.json({ message: "Loan deleted" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const getLoanArray = async (req, res) => {
  if (req.user) {
    await req.user.populate({
      path: "loanArray",
    });
    res.json(req.user.loanArray);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = { addLoan, updateLoan, deleteLoan, getLoanArray };
