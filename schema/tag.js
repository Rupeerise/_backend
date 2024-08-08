const Joi = require("joi");
const targetSchema = require("./target");

const tagSchema = Joi.object({
  name: Joi.string().required(),
  targets: Joi.array().items(targetSchema),
  tagType: Joi.string()
    .valid("income", "variable expense", "emi", "loan", "investment")
    .required(),
  timePeriod: Joi.number().when("tagType", {
    is: Joi.string().valid("emi", "loan", "investment"),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

module.exports = tagSchema;
