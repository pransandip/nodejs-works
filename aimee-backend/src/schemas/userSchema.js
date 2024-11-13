const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("../middlewares/validate-request");
const Role = require("../config/role");
const userService = require("../services/user.service");

// schema functions
const Cschema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().valid(Role.Admin, Role.User).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  address: Joi.string(),
  city: Joi.string(),
  postCode: Joi.string(),
  phone: Joi.string(),
  photo: Joi.string(),
  emailVerified: Joi.string().min(2),
  jobTitle: Joi.string(),
  totalHolidays: Joi.string(),
  remainingHolidays: Joi.string(),
  holidayDate: Joi.string(),
  holidayReason: Joi.string(),
  joinedDate: Joi.string(),
  performance: Joi.string(),
  workingHours: Joi.string(),
  status: Joi.string().min(2),
  linkedinUrl: Joi.string(),
});

function createSchema(req, res, next) {
  console.log("into user schema");
  validateRequest(req, next, Cschema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    role: Joi.string().valid(Role.Admin, Role.User).empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  }).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

function authenticateSchema(req, res, next) {
  validateRequest(req, next, authSchema);
}

module.exports = {
  Cschema,
  authSchema,
  createSchema,
  updateSchema,
  authenticateSchema,
};