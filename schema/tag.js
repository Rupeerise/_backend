const Joi = require("joi");
const targetSchema = require("./target");

const tagSchema = Joi.object({
  name: Joi.string().required(),
  tagType: Joi.string()
    .valid("income", "variable expense", "emi", "loan repayment", "investment")
    .required(),
  targets: Joi.array().items(targetSchema),
});

module.exports = tagSchema;
