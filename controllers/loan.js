const Loan = require("../models/loan");
const loanSchema = require("../schema/loan");

const addLoan = async (req, res) => {
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
    let newLoan = new Loan({
      name,
      amount,
      interestRate,
      timePeriod,
      tagType,
    });
    await newLoan.save();
    req.user.loanArray.push(newLoan);
    await req.user.save();
    res.json({ newLoan });
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
    await loan.remove();
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
