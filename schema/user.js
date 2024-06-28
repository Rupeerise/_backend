const Joi = require("joi");
const tagSchema = require("./tag");
const paymentSchema = require("./payment");

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  tags: Joi.array().items(tagSchema),
  payments: Joi.array().items(paymentSchema),
});
