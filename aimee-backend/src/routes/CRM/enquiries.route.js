const express = require('express');
//const multer = require('multer');
const validate = require('../../middlewares/validate');
const enquiriesController = require('../../controllers/CRM/enquiries.controller');
const upload = require('../../utils/fileUpload');
const {createEnquiriesSchema, updateEnquiriesSchema, getAllEnquiriesSchema, getAllEnqByCustIdSchema, enquireSearchSchema} = require('../../schemas/enquiresSchema');

// Set up Multer to handle file uploads
// const storage = multer.memoryStorage(); // You can adjust storage as per your needs
// const upload = multer({ storage: storage });

const router = express.Router();

router.post('/create', enquiriesController.createEnquire);
router.post('/update/:id', updateEnquiriesSchema, enquiriesController.updateEnquire);
router.post('/getAllEnquires', getAllEnquiriesSchema, enquiriesController.getAllEnquires);
router.get('/getById/:id', enquiriesController.getById);
router.get('/getDetails/:id', enquiriesController.getDetails);
router.get('/delete/:id', enquiriesController.deletebyId);
router.post('/documentupload', upload.single('document'), enquiriesController.documentupload);
router.post('/getAllEnqByCustId', getAllEnqByCustIdSchema, enquiriesController.getAllEnquiresByCustId);
router.post('/searchEnquires', enquiriesController.enquireSearch);

module.exports = router;