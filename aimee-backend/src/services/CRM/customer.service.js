const { Sequelize } = require("sequelize");
const db = require("../../config/config");
const { tokenVerification } = require("../../validations/auth.validation");
const { upload } = require("../../controllers/file.controller");
const path = require("path");
var fs = require('fs');

async function getAll(req) {
  const pageSize = req.body.pageSize;
  const page = req.body.page;
  let errorMsg = {};
  const tokenReturndata = await tokenVerification(req);
  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    return await db.Customer.findAll({
      pageSize,
      page,
      where: {},
      order: [['createdAt', 'DESC']]
    });
  }
}

async function getAllCustomers(req) {
  let errorMsg = {};
  // const tokenReturndata = await tokenVerification(req);
  // if (tokenReturndata.error) {
  //   errorMsg.error = tokenReturndata.error;
  //   return errorMsg;
  // } else {
  //   return await db.Customer.findAll();
  // }
  return await db.Customer.findAll({order: [['createdAt', 'DESC']]});
}

async function getById(req) {
  let errorMsg = {};
  let id = req.params.id;
  //const tokenReturndata = await tokenVerification(req);
  // if (tokenReturndata.error) {
  //   errorMsg.error = tokenReturndata.error;
  //   return errorMsg;
  // } else {
  return await getCustomer(id);
  //}
}

async function getByEmail(req) {
  let errorMsg = {};
  let id = req.body.email;
  // const tokenReturndata = await tokenVerification(req);
  // if (tokenReturndata.error) {
  //   errorMsg.error = tokenReturndata.error;
  //   return errorMsg;
  // } else {
  const customer = await db.Customer.findOne({
    where: {
      email: id,
    },
  });
  return customer;
  // }
}

async function create(req, res) {
  let params = req.body;
  let date = new Date();
  try {
    const tokenReturndata = await tokenVerification(req);
    if (tokenReturndata.error) {
      return tokenReturndata.error;
    } else {
      if (await db.Customer.findOne({ where: { email: params.email } })) {
        return { message: `Email  ${params.email}  is already registered` };
      } else {
        if (req.files && req.files.companyLogo) {
          let logoFile = req.files.companyLogo;
          var timestamp = date.getTime();
          let fileName = `${timestamp}-${logoFile.name}`;
          const uploadsDir = path.join(
            __dirname,
            "../../assets/uploads/" + fileName
          );
          let sample = await logoFile.mv(uploadsDir, async (err) => {
            if (err) {
              return { message: "Couldn't upload file" };
            }
          });
          params.companyLogo = fileName;
        }
        if (
          req.files &&
          req.files.documents &&
          Array.isArray(req.files.documents)
        ) {
          let docURls = [];
          for (let doc of req.files.documents) {
            let docFiles = doc;
            var timestamp = date.getTime();
            let fileName = `${timestamp}-${docFiles.name}`;
            const uploadsDir = path.join(
              __dirname,
              "../../assets/documents/" + fileName
            );
            let sample = await docFiles.mv(uploadsDir, async (err) => {
              if (err) {
                return { message: "Couldn't upload documents" };
              }
            });
            docURls.push(fileName);
          }
          params.documents = JSON.stringify(docURls);
        }
        if (
          req.files &&
          req.files.documents &&
          !Array.isArray(req.files.documents)
        ) {
          let docFile = req.files.documents;
          let fileName = `${timestamp}-${docFile.name}`;
          const uploadsDir = path.join(
            __dirname,
            "../../assets/documents/" + fileName
          );
          let sample = await docFile.mv(uploadsDir, async (err) => {
            if (err) {
              return { message: "Couldn't upload file" };
            }
          });
          params.documents = JSON.stringify(fileName);
        }
        const customer = new db.Customer(params);
        await customer.save();
        return { message: `customer ${params.email} created` };
      }
    }
  } catch (error) {
    console.log(error);
  }
}
const getRelativePath = (fileName) => {
  return path.join(__dirname, "../../assets/documents/", fileName);
};
const getRelativePath2 = (fileName) => {
  return path.join(__dirname, "../../assets/uploads/" + fileName);
};
async function updateCustomer(req) {
  let errorMsg = {};
  let id = req.params.id;
  let params = req.body;
  let date = new Date();
  var timestamp = date.getTime();
  try {
    const customer = await getCustomer(id);
    if (customer && customer.documents) {
      if (Array.isArray(JSON.parse(customer.documents))) {
        for (let doc of JSON.parse(customer.documents)) {
          if (getRelativePath(doc)) {
            fs.unlinkSync(getRelativePath(doc));
          }
        }
      } else if (!Array.isArray(JSON.parse(customer.documents))) {
        if (getRelativePath(JSON.parse(customer.documents))) {
          fs.unlinkSync(getRelativePath(JSON.parse(customer.documents)));
        }
      }
    }
    if (customer.companyLogo) {
      if (getRelativePath2(JSON.parse(customer.companyLogo))) {
        fs.unlinkSync(getRelativePath2(JSON.parse(customer.companyLogo)));
      }
    }
    const tokenReturndata = await tokenVerification(req);
    if (tokenReturndata.error) {
      errorMsg.error = tokenReturndata.error;
      return errorMsg;
    } else {
      if (req.files && req.files.companyLogo) {
        let logoFile = req.files.companyLogo;
        let fileName = `${timestamp}-${logoFile.name}`;

        const uploadsDir = path.join(
          __dirname,
          "../../assets/uploads/" + fileName
        );
        let sample = await logoFile.mv(uploadsDir, async (err) => {
          if (err) {
            return { message: "Couldn't upload file" };
          }
        });
        params.companyLogo = JSON.stringify(fileName);
      }
      if (
        req.files &&
        req.files.documents &&
        Array.isArray(req.files.documents)
      ) {
        let docURls = [];
        for (let doc of req.files.documents) {
          let docFiles = doc;
          let fileName = `${timestamp}-${docFiles.name}`;
          const uploadsDir = path.join(
            __dirname,
            "../../assets/documents/" + fileName
          );
          let sample = await docFiles.mv(uploadsDir, async (err) => {
            if (err) {
              return { message: "Couldn't upload documents" };
            }
          });
          docURls.push(fileName);
        }
        params.documents = JSON.stringify(docURls);
      }
      if (
        req.files &&
        req.files.documents &&
        !Array.isArray(req.files.documents)
      ) {
        let docFile = req.files.documents;
        let fileName = `${timestamp}-${docFile.name}`;
        const uploadsDir = path.join(
          __dirname,
          "../../assets/documents/" + fileName
        );
        let sample = await docFile.mv(uploadsDir, async (err) => {
          if (err) {
            return { message: "Couldn't upload file" };
          }
        });
        params.documents = JSON.stringify(fileName);
      }
      Object.assign(customer, params);
      await customer.save();

      return { message: `customer ${params.email} updated` };
    }
  } catch (error) {
    console.log(error);
  }
}

async function _delete(req) {
  let errorMsg = {};
  let id = req.params.id;
  const customer = await getCustomer(id);
  const tokenReturndata = await tokenVerification(req);
  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    await customer.destroy();
  }
}

async function getCustomer(id) {
  const customer = await db.Customer.findByPk(id);
  if (!customer) throw "Customer not found";
  return customer;
}

async function getCustomerSearchData(req) {
  let errorMsg = {};
  const customerRef = req.body.customerRef;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const offset = req.body.page * req.body.pageSize;
  const limit = req.body.pageSize;
  const page = req.body.page;

  const tokenReturndata = await tokenVerification(req);
  if (tokenReturndata.error) {
    errorMsg.error = tokenReturndata.error;
    return errorMsg;
  } else {
    return await db.Customer.findAll({
      limit,
      page,
      $or: [
        {
          customerRef: {
            $like: customerRef,
          },
        },
        {
          firstName: {
            $like: firstName,
          },
        },
        {
          lastName: {
            $like: lastName,
          },
        },
        {
          email: {
            $like: email,
          },
        },
        {
          phone: {
            $like: phone,
          },
        },
      ],
    });
  }
}

module.exports = {
  getAll,
  getById,
  getAllCustomers,
  create,
  updateCustomer,
  delete: _delete,
  getCustomerSearchData,
  getByEmail,
};
