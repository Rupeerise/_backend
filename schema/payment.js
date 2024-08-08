const Joi = require("joi");

const paymentSchema = Joi.object({
  tagid: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  paymentType: Joi.string().valid("credit", "debit").required(),
  isDone: Joi.boolean().default(false),
});

module.exports = paymentSchema;
