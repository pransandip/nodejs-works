const express = require("express");
const customerController = require("../../controllers/CRM/customer.controller");
const fileController = require("../../controllers/file.controller");
const {
  customerSchema,
  updateCustomerSchema,
  getAllCustomerSchema,
} = require("../../schemas/CRM/customerSchema");

const router = express.Router();
const uploadFileCheck = require("../../../src/middlewares/upload");

router.get("/", customerController.getAll);
router.get("/:id", customerController.getCustomerById);
router.post("/getDataByEmail", customerController.getDataByEmail);
router.post(
  "/getAllCustomers",
  getAllCustomerSchema,
  customerController.getAllCustomers
);
router.post(
  "/create",
  customerSchema,
  customerController.createCustomer
);
router.post(
  "/update/:id",
  updateCustomerSchema,
  customerController.updateCustomer
);
router.post("/upload", fileController.upload);
router.post("/search", customerController.getSearchCustomers);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
