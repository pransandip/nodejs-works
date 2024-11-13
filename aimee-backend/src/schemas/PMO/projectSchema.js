const Joi = require("joi");
const validateRequest = require("../../middlewares/validate-request");

function createProjectSchema(req, res, next) {
  const schema = Joi.object({
    projectRef: Joi.string().required(),
    enquiryID: Joi.number().required(),
    customerID: Joi.number().required(),
    quoteID: Joi.number().required(),
    jobRed: Joi.string().required(),
    projectTitle: Joi.string().required(),
    projectContent: Joi.string().required(),
    createdDateTime: Joi.string().required(),
    estimatedStartDate: Joi.string().email().required(),
    completionDate: Joi.string().min(6),
    status: Joi.string().min(2),
    notes: Joi.string().min(3),
    documents: Joi.string().min(5)
  });
  validateRequest(req, next, schema);
}

function updateProjectSchema(req, res, next) {
  const schema = Joi.object({
    projectRef: Joi.string().required(),
    enquiryID: Joi.number().required(),
    customerID: Joi.number().required(),
    quoteID: Joi.number().required(),
    jobRed: Joi.string().required(),
    projectTitle: Joi.string().required(),
    projectContent: Joi.string().required(),
    createdDateTime: Joi.string().required(),
    estimatedStartDate: Joi.string().email().required(),
    completionDate: Joi.string().min(6),
    status: Joi.string().min(2),
    notes: Joi.string().min(3),
    documents: Joi.string().min(5)
  });
  validateRequest(req, next, schema);
}

function getAllProjectSchema(req, res, next) {
  const schema = Joi.object({
      page: Joi.number().required(),
      pageSize: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function getAllProjectByCustIdSchema(req, res, next) {
  const schema = Joi.object({
      page: Joi.number().required(),
      pageSize: Joi.number().required(),
      customerId:Joi.number().required()
  });
  validateRequest(req, next, schema);
}

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  getAllProjectSchema,
  getAllProjectByCustIdSchema
};
