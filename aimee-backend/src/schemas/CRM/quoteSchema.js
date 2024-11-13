const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("../../middlewares/validate-request");

function createQuoteSchema(req, res, next) {
  const schema = Joi.object({
    QuoteRef: Joi.string().required(),
    EnquiryRef: Joi.string().required(),
    CustomerID: Joi.string().required(),
    JobRef: Joi.string(),
    CustomerEmail: Joi.string().required(),
    CustomerName: Joi.string(),
    CustomerAddress: Joi.string().min(6),
    BillingAddress: Joi.string().min(6),
    DeliveryAddress: Joi.string().min(6),
    AdditionalReceipts: Joi.string(),
    CustomerPhone: Joi.string().required(),
    CustomerContactName: Joi.string().required(),
    QuoteTitle: Joi.string().required(),
    QuoteContent: Joi.string().min(4).required(),
    QuoteDateTime: Joi.string(),
    TenderSubmissionDate: Joi.string().required(),
    Status: Joi.string().valid("Draft", "Sent To Customer", "Archived", "Rejected" , "Delete", "Approved").required(),
    ModifiedDateTime: Joi.string().required(),
    Workflow: Joi.string()
      .valid("Processed", "Unprocessed", "Draft", "Archived")
      .required(),
    EstimatedValue: Joi.string().required(),
    PurchaseOrder: Joi.string().required(),
    AssignedAdmin: Joi.string().required(),
    AdminNotes: Joi.string().required(),
    ProjectJobDescription: Joi.string(),
    ProjectRef:  Joi.string(),
    QuoteValidFrom: Joi.string(),
    PaymentWithin: Joi.string(),
    BillingType: Joi.string(),
    ServiceType: Joi.string(),
    AssignedCreator: Joi.string(),
    AssignedApprover: Joi.string(),
    SendReminders: Joi.string(),
    ReminderStatus: Joi.string(),
    LastReminderSend: Joi.string(),
    Steel: Joi.string(),
    Finish: Joi.string(),
    FabDrawing: Joi.string(),
    Bolts: Joi.string(),
    AnchorBolts: Joi.string(),
    Programme: Joi.string(),
    Comments: Joi.string(),
    AdditionalInfo: Joi.string(),
    OnershipOfGoods: Joi.string(),
    PaymentTerms: Joi.string(),
    Tasks: Joi.string(),
    ReminderStatus:Joi.string()
    .valid("Send", "Do Not Send"),
    quoteFields : Joi.array().items(Joi.object().keys({
      key:Joi.string(),
      value:Joi.string()
    })),
  });
  validateRequest(req, next, schema);
}

function updateQuoteSchema(req, res, next) {
  const schema = Joi.object({
    QuoteRef: Joi.string().required(),
    EnquiryRef: Joi.string().required(),
    CustomerID: Joi.string().required(),
    JobRef: Joi.string().required(),
    CustomerEmail: Joi.string().required(),
    CustomerAddress: Joi.string().min(6),
    CustomerPhone: Joi.string().required(),
    CustomerContactName: Joi.string().required(),
    QuoteTitle: Joi.string().required(),
    QuoteContent: Joi.string().min(4).required(),
    QuoteDateTime: Joi.string().min(6),
    TenderSubmissionDate: Joi.string().required(),
    Status: Joi.string().valid("Draft", "Sent To Customer", "Archived", "Rejected" , "Delete", "Approved").required(),
    ModifiedDateTime: Joi.string().required(),
    Workflow: Joi.string()
      .valid("Processed", "Unprocessed", "Draft", "Archived")
      .required(),
    EstimatedValue: Joi.string().required(),
    PurchaseOrder: Joi.string().required(),
    AssignedAdmin: Joi.string().required(),
    AdminNotes: Joi.string().required(),
    ProjectJobDescription: Joi.string(),
    ProjectRef:  Joi.string(),
    QuoteValidFrom: Joi.string(),
    PaymentWithin: Joi.string(),
    BillingType: Joi.string(),
    ServiceType: Joi.string(),
    AssignedCreator: Joi.string(),
    AssignedApprover: Joi.string(),
    SendReminders: Joi.string(),
    ReminderStatus: Joi.string(),
    LastReminderSend: Joi.string(),
    Steel: Joi.string(),
    Finish: Joi.string(),
    FabDrawing: Joi.string(),
    Bolts: Joi.string(),
    AnchorBolts: Joi.string(),
    Programme: Joi.string(),
    Comments: Joi.string(),
    AdditionalInfo: Joi.string(),
    OnershipOfGoods: Joi.string(),
    PaymentTerms: Joi.string(),
    Tasks: Joi.string(),
    ReminderStatus:Joi.string()
    .valid("Send", "Do Not Send"),
  });
  validateRequest(req, next, schema);
}

function getAllQuoteSchema(req, res, next) {
  const schema = Joi.object({
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

module.exports = {
  createQuoteSchema,
  updateQuoteSchema,
  getAllQuoteSchema,
};
