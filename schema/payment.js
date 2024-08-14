const Joi = require("joi");

const paymentSchema = Joi.object({
  tagid: Joi.string().allow(null, "").optional(),
  loanid: Joi.string().allow(null, "").optional(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  paymentType: Joi.string().valid("credit", "debit").required(),
  isDone: Joi.boolean().default(false),
}).or("tagid", "loanid"); // Ensure at least one of tagid or loanid is present

module.exports = paymentSchema;
