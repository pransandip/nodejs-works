const db = require("../../config/config");
const { tokenVerification } = require("../../validations/auth.validation");
const sendQuoteMail = require("../../templates/quoteTemplate");
const sendQuoteMailToCust = require("../../templates/quoteCustomerTemplate");
const { Sequelize, DataTypes } = require("sequelize");
const {encrypt, decrypt} = require("../../utils/utils")
require("dotenv").config();
const dialect = "mssql";
const host = process.env.DB_HOST;
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host, dialect }
);
const queryInterface = sequelize.getQueryInterface();



async function createQuote(req) {
  const { quoteFields } = req.body;
  delete req.body.quoteFields;
  const params = req.body;

  const quote = new db.Quote(params);
  await quote.save();
  let quoteId = quote.dataValues.id;
  for (let columnValue of quoteFields) {
    let obj = {
      quoteId: quoteId,
      key: columnValue.key,
      value: columnValue.value,
      status: 1,
    };
    const QuoteKeyValues = new db.QuoteKeyValues(obj);
    await QuoteKeyValues.save();
  }
  const result = await db.Quote.findAll({
    include: [db.QuoteKeyValues],
    required: false,
  });
  return result;
}

async function getAllQuote(req) {
  const pageSize = req.body.pageSize;
  const page = req.body.page;
  const limit = pageSize;

  let errorMsg = {};
  const tokenReturndata = await tokenVerification(req);
  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    return await db.Quote.findAll({
      limit,
      page,
      where: {},
      order: [['createdAt', 'DESC']]
    });
  }
}

async function getAll(req) {
  let errorMsg = {};
  const tokenReturndata = await tokenVerification(req);
  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    return await db.Quote.findAll({order: [['createdAt', 'DESC']]});
  }
}

async function getQuoteById(id) {
  return await getQuote(id);
}

async function _delete(id) {
  // const id = req.params.id;
  // let errorMsg = {};
  // const tokenReturndata = await tokenVerification(req);

  // if (tokenReturndata.error) {
  //   errorMsg.error = tokenReturndata.error;
  //   return errorMsg;
  // }
  // else{
  const quote = await getQuote(id);
  await quote.destroy();
  // }
}

async function getQuote(id) {
  const quote = await db.Quote.findByPk(id);
  if (!quote) throw "Quote not found";
  return quote;
}

async function updateQuote(req) {
  const id = req.params.id;
  const params = req.body;

  let errorMsg = {};
  const tokenReturndata = await tokenVerification(req);

  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    const quote = await getQuote(id);
    Object.assign(customer, params);
    return await quote.save();
  }
}

async function getQuoteDetails(req) {
  const id = req.params.id;
  db.Quote.hasOne(db.Enquiries, {
    foreignKey: "enquiryRef",
    sourceKey: "EnquiryRef",
  });
  db.Quote.belongsTo(db.Customer, { foreignKey: "CustomerID" });
  db.Customer.hasMany(db.Quote, { foreignKey: "CustomerID" });
  db.Customer.hasMany(db.Enquiries, { foreignKey: "customerID" });
  db.Enquiries.belongsTo(db.Quote, {
    foreignKey: "enquiryRef",
    sourceKey: "EnquiryRef",
  });
  db.Quote.hasMany(db.QuoteKeyValues, { foreignKey: "quoteId" });
  db.QuoteKeyValues.belongsTo(db.Quote, { foreignKey: "quoteId" });

  try {
    const result = await db.Quote.findByPk(id, {
      attributes: ["id", "QuoteRef"
       ,"EnquiryRef", "CustomerID", "JobRef", "CustomerEmail",  "CustomerName","CustomerAddress",  "BillingAddress",  "DeliveryAddress",  "AdditionalReceipts",  "CustomerPhone",  "CustomerContactName",  "QuoteTitle",  "QuoteContent",
      "QuoteDateTime", "TenderSubmissionDate", "Status", "ModifiedDateTime", "Workflow", "EstimatedValue", "PurchaseOrder", "AssignedAdmin", "AdminNotes", "ProjectJobDescription", "ProjectRef","QuoteValidFrom","PaymentWithin",
      "BillingType", "ServiceType", "AssignedCreator", "AssignedApprover", "SendReminders", "ReminderStatus", "LastReminderSend", "Steel",
      "Finish","FabDrawing","Bolts","AnchorBolts","Programme", "Comments", "AdditionalInfo", "OnershipOfGoods", "PaymentTerms", "Tasks", "ReminderStatus", "quoteFields "
    ],
      required:false,

      include: [
        {
          model: db.Enquiries,
          required:false,
          attributes: ["id", "enquiryRef", "customerID"],
        },
        {
          model: db.Customer,
          required:false,
          attributes: ["firstName", "lastName", "email", "address" ,"country", "city", "companyName"],
        },
        {
          model: db.QuoteKeyValues,
          required:false,
          attributes: ["key", "value"],
          where: {
            status: 1,
          },
        },
      ],
    });
    return result;
  } catch (error) {}
}

async function sendMail(req) {

  let data = {
    email:req.body.email
  }
  await sendQuoteMail(data)
}

async function sendQuoteMailToCustomer(req) {
  let id = req.body.id;
  let textString = id.toString();
  let encriptedId = await encrypt(textString);
   console.log("encriptedId",encriptedId);
  let data = {
    email: req.body.email,
    firstName: req.body.firstName,
    ProjectRef : req.body.ProjectRef,
    QuoteValidFrom : req.body.QuoteValidFrom,
    PaymentWithin : req.body.PaymentWithin,
    BillingType : req.body.BillingType,
    ServiceType : req.body.ServiceType,
    Steel : req.body.Steel,
    Finish : req.body.Finish,
    FabDrawing : req.body.FabDrawing,
    Bolts : req.body.Bolts,
    AnchorBolts : req.body.AnchorBolts,
    Programme : req.body.Programme,
    Comments : req.body.Comments,
    AdditionalInfo : req.body.AdditionalInfo,
    OnershipOfGoods : req.body.OnershipOfGoods,
    PaymentTerms : req.body.PaymentTerms,
    quoteid:encriptedId
  }
 await sendQuoteMailToCust(data);
}

async function customerAcceptQuote(req) {
  let id = req.params.id;
  let decriptedId = await decrypt(id);
  let quoteId = parseInt(decriptedId);
  await db.Quote.update({ Status: 'Archived' }, { where: { id:quoteId } });
}

async function customerReject(req) {
  let id = req.params.id;
  let decriptedId = await decrypt(id);
  let quoteId = parseInt(decriptedId);
  await db.Quote.update({ Status: 'Rejected' }, { where: { id:quoteId } });
}

module.exports = {
  createQuote,
  getAll,
  getAllQuote,
  getQuoteById,
  updateQuote,
  delete: _delete,
  getQuoteDetails,
  sendMail,
  sendQuoteMailToCustomer,
  customerAcceptQuote,
  customerReject
};
