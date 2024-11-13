const bcrypt = require('bcryptjs');

const db = require('../../config/config');
const {tokenVerification} = require('../../validations/auth.validation');

module.exports = {
    create,
    
};


async function create(req, res) {
  console.log("helloio----------------->")
    return "hello"
    let errorMsg = {};
    let params = req.body;
    const image = req.file
  try {
    
    const tokenReturndata = await tokenVerification(req);
    if (tokenReturndata.error) {
      errorMsg.error = tokenReturndata.error;
      return errorMsg;
    } else {
      if (await db.Job.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
      }
      const Job = new db.Job(params);
     let savedData=  await Job.save();
    }  
  } catch (error) {
    console.log(error)
  }
  
  }