const Joi = require("joi");
const targetSchema = require("./target");

const tagSchema = Joi.object({
  name: Joi.string().required(),
  targets: Joi.array().items(targetSchema),
  tagType: Joi.string().valid("income", "expense").required(),
  timePeriod: Joi.number().when("tagType", {
    is: Joi.string().valid("emi", "loan", "investment"),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  color: Joi.string().required(),
});

module.exports = tagSchema;
