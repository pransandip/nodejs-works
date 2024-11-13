const bcrypt = require('bcryptjs');

const db = require('../../config/config');
const {tokenVerification} = require('../../validations/auth.validation');
const { upload } = require("../../controllers/file.controller");
const path = require("path");
const express = require("express");
const socketIo = require('socket.io');
const http = require('http');
const app = express();
//for socket server
const server = http.createServer(app);
const io = socketIo(server);

module.exports = {
    getAll,
    getById,
    createEnquries,
    update,
    delete: _delete,
    uploadDoc,
    getAllByCustId,
    getSearchData,
    getDetails
};

async function getAll(req) {

    const pageSize = req.body.pageSize;
    const page = req.body.page;

    const offset = page * pageSize;
    const limit = pageSize;
    let errorMsg ={};
    const tokenReturndata = await tokenVerification(req);
//     if(tokenReturndata.error){
//         errorMsg.error=  tokenReturndata.error;
//        return errorMsg;
//     }
//    else{
        return await db.Enquiries.findAll({
            limit,
            page,
            where: {}, // conditions
            order: [['createdAt', 'DESC']]
        });
   //}
    
}

async function getAllByCustId(req) {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const offset = page * pageSize;
    const limit = pageSize;
    let customerid = req.body.customerid;
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await db.Enquiries.findAll({
        limit,
        page,
        where: {customerID:customerid} //conditions
      });
   }
    
}

async function getById(req) {
    let id = req.params.id;
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await getEnquiries(id);
   }
    
}

async function getDetails(req) {
    let id = req.params.id;
    let enquiryData = {};
    const enquiries = await db.Enquiries.findByPk(id);
    if (!enquiries) throw 'Enquiries not found';
    enquiryData.enquiry = enquiries;
    if(enquiries){
        let customerId = enquiries.dataValues.customerID;
        const userData = await db.Customer.findByPk(customerId);
        enquiryData.customer = userData.dataValues;
    }
    return enquiryData;
}

async function createEnquries(params) {
    // validate
    let customerData = await db.Customer.findOne({ where: { email: params.customerID } });

    let customerObj = {};
    let enqueryObject = {};

    enqueryObject.enquiryRef = params.enquiryRef;
    enqueryObject.title = params.title;
    enqueryObject.customerContactName = params.customerContactName;
    enqueryObject.subject = params.subject;
    enqueryObject.enquiryContent = params.enquiryContent;
    enqueryObject.documents = params.documents;
    enqueryObject.status = params.status;
    enqueryObject.dateTime = params.dateTime;

    if (customerData) {
        console.log("into if condition");
        //console.log("customerDatacustomerData",customerData.dataValues.id);
        enqueryObject.customerID = customerData.dataValues.id;
        //throw 'Email "' + params.email + '" is already registered';
    }
    else{
        customerObj.customerRef= 'CUS-REF-'+Math.floor(1000 + Math.random() * 9000);
        customerObj.firstName= 'NA';
        customerObj.email= params.customerID;
        customerObj.address= params.address;
        customerObj.phone=params.phone;
        customerObj.companyName= params.companyName;
        customerObj.status= 'Active';
        const customer = new db.Customer(customerObj);
        let returnCustData = await customer.save();
        enqueryObject.customerID = returnCustData.dataValues.id;
       // console.log("returnCustDatareturnCustData",returnCustData);
    }

    // if (req.files && req.files.companyLogo) {
    //     let logoFile = req.files.companyLogo;
    //     const uploadsDir = path.join(
    //       __dirname,
    //       "../../assets/uploads/" + logoFile.name
    //     );
    //     let sample = await logoFile.mv(uploadsDir, async (err) => {
    //       if (err) {
    //         return { message: "Couldn't upload file" };
    //       }
    //     });
    //   }
  
    const enquiries = new db.Enquiries(enqueryObject);
    // save user
    await enquiries.save();

    const apiData = {
        message: 'Hello from the create enquery API!',
        timestamp: new Date().toISOString(),
    };

    io.on('connection', (socket) => {

        console.log("enquires service for socket!!!!!!", socket.id);
        io.to(socket.id).emit('createenq', apiData);
        io.emit('createenq', apiData);
      
        // socket.on('disconnect', () => {
        //   console.log('A user disconnected');
        //   io.emit('createenq', apiData);
        // });
      
    });
}

async function update(req) {

    let id = req.params.id;
    let params = req.body;
    const enquire = await getEnquiries(id);


    // validate
    // const usernameChanged = params.username && user.username !== params.username;
    // if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    //     throw 'Username "' + params.username + '" is already taken';
    // }


    // hash password if it was entered
    // if (params.password) {
    //     params.passwordHash = await bcrypt.hash(params.password, 10);
    // }


    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
   
    // copy params to user and save
    Object.assign(enquire, params);
    await enquire.save();
   }

}

async function _delete(req) {
    let id = req.params.id;
    const enquery = await getEnquiries(id);
    //const tokenReturndata = await tokenVerification(req);
    // if(tokenReturndata.error){
    //    errorMsg.error =  tokenReturndata.error;
    //    return errorMsg;
    // }
    // else{
        await enquery.destroy();
    //}
   
}

// helper functions

async function getEnquiries(id) {

    const enquiries = await db.Enquiries.findByPk(id);
    if (!enquiries) throw 'Enquiries not found';
    return enquiries;
}

async function uploadDoc(file) {
    console.log("filefilefile",file);
    // const enquiries = await db.Enquiries.findByPk(id);
    // console.log("enquiriesenquiriesenquiries",enquiries);
    // if (!enquiries) throw 'Enquiries not found';
    // return enquiries;
}

async function getSearchData(req) {
   
    const title = req.body.title;
    const enquiryRef =  req.body.enquiryRef;
    const customerContactName =  req.body.customerContactName;
    const subject =  req.body.subject;
    const enquiryContent =  req.body.enquiryContent;
    const customerid =  req.body.customerId;

    const offset =  req.body.page *  req.body.pageSize;
    const limit =  req.body.pageSize;
    const page =  req.body.page;

    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
       errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await db.Enquiries.findAll({
        limit,
        page,
        $or: [
            {
                title: 
                {
                    $like: title
                }
            }, 
            {
                enquiryRef: 
                {
                    $like: enquiryRef
                }
            },
            {
                customerContactName: 
                {
                    $like: customerContactName
                }
            },
            {
                subject: 
                {
                    $like: subject
                }
            }
        ]
      });
   }

   
}