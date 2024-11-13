const projectService = require('../../services/PMO/project.service');


// user controller functions
function getAllProject(req, res, next) {
    projectService.getAll(req)
        .then(project => res.json(project))
        .catch((error) => res.json({ message: error}));
}

function getById(req, res, next) {
    projectService.getById(req)
        .then(project => res.json(project))
        .catch((error) => res.json({ message: error}));
}

function createProject(req, res, next) {
    projectService.createProject(req.body)
        .then(() => res.json({ message: 'Project created!!' }))
        .catch((error) => res.json({ message: error}));
}

function updateProject(req, res, next) {
    projectService.update(req)
        .then(() => res.json({ message: 'Project Updated!!' }))
        .catch((error) => res.json({ message: error}));
}

function deletebyId(req, res, next) {
    projectService.delete(req)
        .then(() => res.json({ message: 'Project deleted!!' }))
        .catch((error) => res.json({ message: error}));
}

function documentupload(req, res, next) {
    projectService.uploadDoc(req.file)
        .then(() => res.json({ message: 'Project document uploaded!!' }))
        .catch((error) => res.json({ message: error}));
}

function getAllProjectByCustId(req, res, next) {
    projectService.getAllByCustId(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function getAllProjectByEnquiresId(req, res, next) {
    projectService.getAllByEnqId(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function getAllProjectByQuoteID(req, res, next) {
    projectService.getAllByEnqId(req)
        .then(enquries => res.json(enquries))
        .catch((error) => res.json({ message: error}));
}

function projectSearch(req, res, next) {
    const bodyData = req.body;
    projectService.getSearchData(req)
        .then(project => res.json(project))
        .catch((error) => res.json({ message: error}));
}

module.exports  = {
    createProject,
    getAllProject,
    updateProject,
    getById,
    deletebyId,
    documentupload,
    getAllProjectByCustId,
    projectSearch,
    getAllProjectByEnquiresId
  };