const Joi = require("joi");

const loanSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  interestRate: Joi.number().required(),
  timePeriod: Joi.number().required(),
  tagType: Joi.string().valid("emi", "loan", "investment").required(),
});

module.exports = loanSchema;