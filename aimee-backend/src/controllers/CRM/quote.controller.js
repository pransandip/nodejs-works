const quoteService = require("../../services/CRM/quote.service");

function createQuote(req, res, next) {
  quoteService
    .createQuote(req)
    .then(() => res.json({ message: "Quote created" }))
    .catch((error) => res.json({ message: error }));
}

function getAllQuote(req, res, next) {
  quoteService
    .getAll(req)
    .then((quote) => res.json(quote))
    .catch(next);
}

function getQuoteById(req, res, next) {
  quoteService
    .getQuoteById(req.params.id)
    .then((quote) => res.json(quote))
    .catch(next);
}

function updateQuote(req, res, next) {
  quoteService
    .updateQuote(req)
    .then(() => res.json({ message: "Quote updated" }))
    .catch((error) => res.json({ message: error }));
}

function getAllQuotes(req, res, next) {
  const pageSize = req.body.pageSize;
  const page = req.body.page;
  quoteService
    .getAllQuote(req)
    .then((quote) => res.json(quote))
    .catch(next);
}

function getQuoteDetails(req, res, next) {
  quoteService
    .getQuoteDetails(req)
    .then((quote) => res.json(quote))
    .catch(next);
}

function sendQuoteMail(req, res, next) {
  quoteService
    .sendMail(req)
    .then(() => res.json({ message: "Email sent" }))
    .catch(next);
}

function sendQuoteMailToCustomer(req, res, next) {
  quoteService
    .sendQuoteMailToCustomer(req)
    .then(() => res.json({ message: "Email sent to Customer" }))
    .catch(next);
}

function acceptQuote(req, res, next) {
  quoteService
    .customerAcceptQuote(req)
    .then(() => res.json({ message: "Quote is accepted" }))
    .catch(next);
}

function rejectQuote(req, res, next) {
  quoteService
    .customerReject(req)
    .then(() => res.json({ message: "Quote is rejected" }))
    .catch(next);
}

module.exports = {
  createQuote,
  getAllQuote,
  getQuoteById,
  updateQuote,
  getAllQuotes,
  getQuoteDetails,
  sendQuoteMail,
  sendQuoteMailToCustomer,
  acceptQuote,
  rejectQuote
};
