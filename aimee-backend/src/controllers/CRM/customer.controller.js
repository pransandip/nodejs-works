const customerService = require("../../services/CRM/customer.service");

async function createCustomer(req, res, next) {
  try {
    let customer = await customerService.create(req, res);
    return res.status(200).send({ message: customer.message });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
}

function getAllCustomers(req, res, next) {
  customerService
    .getAll(req)
    .then((customers) => res.json(customers))
    .catch(next);
}

function getAll(req, res, next) {
  customerService
    .getAllCustomers(req)
    .then((customers) => res.json(customers))
    .catch(next);
}

function getCustomerById(req, res, next) {
  customerService
    .getById(req)
    .then((customer) => res.json(customer))
    .catch((error) => res.json({ message: error }));
}

function getDataByEmail(req, res, next) {
  customerService
    .getByEmail(req)
    .then((customer) => res.json(customer))
    .catch((error) => res.json({ message: error }));
}

async function updateCustomer(req, res, next) {
  try {
    let customer = await customerService.updateCustomer(req,res)
      return res.status(200).send({message:customer.message})
  } catch (error) {
    return res.status(400).send({message:error})
  }
}

function deleteCustomer(req, res, next) {
  customerService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

function getSearchCustomers(req, res, next) {
  customerService
    .getCustomerSearchData(req)
    .then((customers) => res.json(customers))
    .catch((error) => res.json({ message: error }));
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getAll,
  getSearchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getDataByEmail
};
