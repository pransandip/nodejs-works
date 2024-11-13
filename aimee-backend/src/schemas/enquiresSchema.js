const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('../middlewares/validate-request');
const Role = require('../config/role');
const enquiriesService = require('../services/CRM/enquiries.service');

// schema functions

function createEnquiriesSchema(req, res, next) {
    const schema = Joi.object({
        enquiryRef: Joi.string().required(),
        customerID: Joi.number(),
        title: Joi.string().required(),
        customerContactName: Joi.string().min(4).required(),
        subject: Joi.string().min(4).required(),
        enquiryContent: Joi.string().min(4).required(),
		address: Joi.string().min(6),
		documents: Joi.string(),
		status: Joi.string().valid('Early','In Progress','Complete','Late').required(),
		dateTime: Joi.string().min(6)
    });
    validateRequest(req, next, schema);
}

function updateEnquiriesSchema(req, res, next) {
    const schema = Joi.object({
        enquiryRef: Joi.string().required(),
        customerID: Joi.number().required(),
        title: Joi.string().required(),
        customerContactName: Joi.string().min(4).required(),
        subject: Joi.string().min(4).required(),
        enquiryContent: Joi.string().min(4).required(),
		address: Joi.string().min(6),
		documents: Joi.string().min(3),
		status: Joi.string().valid('Early','In Progress','Complete','Late').required(),
		dateTime: Joi.string().min(6)
    });
    validateRequest(req, next, schema);
}

function getAllEnquiriesSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
    });
    validateRequest(req, next, schema);
}

function getAllEnqByCustIdSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
        customerId:Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function enquireSearchSchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
        title:Joi.string(),
        enquiryRef:Joi.string(),
        customerContactName:Joi.string(),
        subject:Joi.string(),
        enquiryContent:Joi.string()
    });
    validateRequest(req, next, schema);
}

module.exports  = {
    createEnquiriesSchema,
    updateEnquiriesSchema,
    getAllEnquiriesSchema,
    getAllEnqByCustIdSchema,
    enquireSearchSchema
  };