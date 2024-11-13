const express = require("express");
const quoteController = require("../../controllers/CRM/quote.controller");
const {
  createQuoteSchema,
  updateQuoteSchema,
  getAllQuoteSchema,
} = require("../../schemas/CRM/quoteSchema");
const router = express.Router();

router.get("/", quoteController.getAllQuote);
router.get("/:id", quoteController.getQuoteById);
router.get("/quoteDetails/:id" , quoteController.getQuoteDetails);
router.post("/create", quoteController.createQuote);
router.post("/update/:id", updateQuoteSchema, quoteController.updateQuote);
router.post("/getAllQuotes", getAllQuoteSchema, quoteController.getAllQuotes);
router.post("/sendQuoteMail", quoteController.sendQuoteMail);
router.post("/sendQuoteMailToCustomer", quoteController.sendQuoteMailToCustomer);
router.get("/acceptquote/:id" , quoteController.acceptQuote);
router.get("/rejectquote/:id" , quoteController.rejectQuote);

module.exports = router;
