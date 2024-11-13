const enquiriesService = require('../../services/CRM/enquiries.service');


// user controller functions

function getAllEnquires(req, res, next) {
    console.log("into the  enquery controller!!!");
    enquiriesService.getAll(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function getById(req, res, next) {
    enquiriesService.getById(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function getDetails(req, res, next) {
    enquiriesService.getDetails(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function createEnquire(req, res, next) {
    console.log("file",req.file);
    enquiriesService.createEnquries(req.body)
        .then(() => res.json({ message: 'Enquries created' }))
        .catch((error) => res.json({ message: error}));
}

function updateEnquire(req, res, next) {
    enquiriesService.update(req)
        .then(() => res.json({ message: 'Enquries Updated' }))
        .catch((error) => res.json({ message: error}));
}

function deletebyId(req, res, next) {
    enquiriesService.delete(req)
        .then(() => res.json({ message: 'Enquiry deleted' }))
        .catch((error) => res.json({ message: error}));
}

function documentupload(req, res, next) {
    enquiriesService.uploadDoc(req.file)
        .then(() => res.json({ message: 'Enquiry document uploaded' }))
        .catch((error) => res.json({ message: error}));
}

function getAllEnquiresByCustId(req, res, next) {
    enquiriesService.getAllByCustId(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function enquireSearch(req, res, next) {
    
    const bodyData = req.body;
    enquiriesService.getSearchData(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}



module.exports  = {
    createEnquire,
    getAllEnquires,
    updateEnquire,
    getById,
    deletebyId,
    documentupload,
    getAllEnquiresByCustId,
    enquireSearch,
    getDetails
  };