const Joi = require("joi");

const targetSchema = Joi.object({
  amount: Joi.number().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
  tagid: Joi.string().required(),
});

module.exports = targetSchema;
