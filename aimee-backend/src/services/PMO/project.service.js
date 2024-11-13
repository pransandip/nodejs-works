const bcrypt = require('bcryptjs');

const db = require('../../config/config');
const {tokenVerification} = require('../../validations/auth.validation');

module.exports = {
    getAll,
    getById,
    createProject,
    update,
    delete: _delete,
    uploadDoc,
    getAllByCustId,
    getSearchData,
    getAllByEnqId,
    getAllByQuoteID
};

async function getAll(req) {

    const pageSize = req.body.pageSize;
    const page = req.body.page;

    const offset = page * pageSize;
    const limit = pageSize;
    let errorMsg ={};
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
        return await db.project.findAll({
            limit,
            page,
            where: {}, // conditions
        });
   }
    
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
    return await db.project.findAll({
        limit,
        page,
        where: {customerID:customerid} //conditions
      });
   }
    
}

async function getAllByEnqId(req) {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const offset = page * pageSize;
    const limit = pageSize;
    let enqid = req.body.enqid;
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await db.project.findAll({
        limit,
        page,
        where: {enquiryID:enqid} //conditions
      });
   }
    
}

async function getAllByQuoteID(req) {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const offset = page * pageSize;
    const limit = pageSize;
    let quoteid = req.body.quoteid;
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await db.project.findAll({
        limit,
        page,
        where: {quoteID:quoteid} //conditions
      });
   }
}

// helper functions
async function getProject(id) {
    const project = await db.project.findByPk(id);
    if (!project) throw 'Project is not found';
    return project;
}

async function getById(req) {
    let id = req.params.id;
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
        errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await getProject(id);
   }
    
}

async function createProject(params) {

    // validate
    // if (await db.Enquiries.findOne({ where: { email: params.email } })) {
    //     throw 'Email "' + params.email + '" is already registered';
    // }

    const project = new db.project(params);
    
    // hash password
    // user.password = await bcrypt.hash(params.password, 10);

    // save user
    await project.save();
}

async function update(req) {

    let id = req.params.id;
    let params = req.body;
    const project = await getProject(id);


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
    await project.save();
   }

}

async function _delete(req) {
    let id = req.params.id;
    const enquery = await getEnquiries(id);
    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
       errorMsg.error =  tokenReturndata.error;
       return errorMsg;
    }
    else{
        await enquery.destroy();
    }
}

async function uploadDoc(file) {
    console.log("filefilefile",file);
    // const enquiries = await db.Enquiries.findByPk(id);
    // console.log("enquiriesenquiriesenquiries",enquiries);
    // if (!enquiries) throw 'Enquiries not found';
    // return enquiries;
}

async function getSearchData(req) {
   
    const projectTitle = req.body.projectTitle;
    const projectRef =  req.body.projectRef;
    const jobRed =  req.body.jobRed;
    

    const offset =  req.body.page *  req.body.pageSize;
    const limit =  req.body.pageSize;
    const page =  req.body.page;

    const tokenReturndata = await tokenVerification(req);
    if(tokenReturndata.error){
       errorMsg.error=  tokenReturndata.error;
       return errorMsg;
    }
   else{
    return await db.project.findAll({
        limit,
        page,
        $or: [
            {
                projectTitle: 
                {
                    $like: projectTitle
                }
            }, 
            {
                projectRef: 
                {
                    $like: projectRef
                }
            },
            {
                jobRed: 
                {
                    $jobRed: jobRed
                }
            }
        ]
      });
   }

   
}