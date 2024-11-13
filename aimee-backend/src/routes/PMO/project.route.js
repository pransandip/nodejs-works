const express = require('express');
//const multer = require('multer');
const validate = require('../../middlewares/validate');
const projectsController = require('../../controllers/PMO/projects.controller');
const upload = require('../../utils/fileUpload');
const {createProjectSchema, updateProjectSchema, getAllProjectSchema, getAllProjectByCustIdSchema} = require('../../schemas/PMO/projectSchema');

// Set up Multer to handle file uploads
// const storage = multer.memoryStorage(); // You can adjust storage as per your needs
// const upload = multer({ storage: storage });

const router = express.Router();

router.post('/create', createProjectSchema, projectsController.createProject);
router.post('/update/:id', updateProjectSchema, projectsController.updateProject);
router.post('/getAllProjects', getAllProjectSchema, projectsController.getAllEnquires);
router.get('/getById/:id', projectsController.getById);
router.get('/delete/:id', projectsController.deletebyId);
router.post('/documentupload', upload.single('document'), projectsController.documentupload);
router.post('/getAllProjectByCustId', getAllProjectByCustIdSchema, projectsController.getAllProjectByCustId);
router.post('/searchProject', projectsController.projectSearch);

module.exports = router;