const Joi = require("joi");

const paymentSchema = Joi.object({
  tagid: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
});

module.exports = paymentSchema;
