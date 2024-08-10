const Joi = require("joi");

const paymentSchema = Joi.object({
  tagid: Joi.string().optional(),
  loanid: Joi.string().optional(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  paymentType: Joi.string().valid("credit", "debit").required(),
  isDone: Joi.boolean().default(false),
}).or("tagid", "loanid");

module.exports = paymentSchema;
