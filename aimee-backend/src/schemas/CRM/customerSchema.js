const Joi = require("joi");
const validateRequest = require("../../middlewares/validate-request");

function customerSchema(req, res, next) {
  const schema = Joi.object({
    customerRef: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().email().required(),
    address: Joi.string().min(6),
    country: Joi.string(),
    city: Joi.string(),
    postCode: Joi.string(),
    phone: Joi.string(),
    companyName: Joi.string(),
    companyLogo: Joi.string(),
    status: Joi.string().valid("Active", "Inactive").required(),
    website: Joi.string(),
    documents: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function updateCustomerSchema(req, res, next) {
  const schema = Joi.object({
    customerRef: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(6),
    country: Joi.string().min(2),
    city: Joi.string().min(3),
    postCode: Joi.string().min(5),
    phone: Joi.string().min(10),
    companyName: Joi.string(),
    companyLogo: Joi.string(),
    status: Joi.string().valid("Active", "Inactive").required(),
    documents: Joi.string().min(3),
    website: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function getAllCustomerSchema(req, res, next) {
  const schema = Joi.object({
      page: Joi.number().required(),
      pageSize: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

module.exports = {
  customerSchema,
  updateCustomerSchema,
  getAllCustomerSchema,
};
