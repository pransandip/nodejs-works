const Joi = require("joi");
const validateRequest = require("../../middlewares/validate-request");

function createJobSchema(req, res, next) {
  const schema = Joi.object({
        jobId: Joi.number().required(),
        jobRed: Joi.string().required(),
        projectRef :Joi.string().required(),
        customerRef:Joi.string().required(), 
        customerId:Joi.number().required(), 
        enquiryRef :Joi.string().required(),
        enquiryId: Joi.number().required(),
        quoteRef :Joi.string().required(),
        quoteId:Joi.number().required(), 
        jobTitle :Joi.string().required(),
        jobDescription :Joi.string().required(),
        materialStatus:Joi.string().valid("To Be Ordered", "Stock","Ordered", "Partially Ordered","Long Lead Item").required(),
        createdDate:Joi.string().required(),
        createdBy :Joi.string().required(),
        estimatedStartDate:Joi.string().required(), 
        completionDate:Joi.string().required(), 
        plannedHours :Joi.number().required(),
        totalHoursWorked :Joi.number().required(),
        drawingStatus :Joi.string().valid("Draft", "NA","IFA", "AFC").required(),
        status :Joi.string().valid("Active", "Completed","Cancelled", "Deleted").required(),
        notes :Joi.string().required(3),
        inPlan :Joi.string().valid("Yes", "No").required(),
        invoiced :Joi.string().valid("Yes", "No").required(),
        workFlow :Joi.string().valid("Being Prepared", "In Progress","On Hold", "Ready To Be Invoiced","Invoiced", "Paid","Cancelled").required(),
        actualCost :Joi.number().required(),
        documents: Joi.string().min(5)
  });

  validateRequest(req, next, schema);
}

module.exports = {
  createJobSchema,
};
