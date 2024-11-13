const express = require('express');
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');
const {
    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessList,
    getSingleBusiness
} = require("../controllers");

const router = express.Router();

router
    .route("/addBusiness")
    .post(
        [authenticateUser, authorizePermissions('admin')],
        addBusiness);
router
    .route("/updateBusiness")
    .patch(
        [authenticateUser, authorizePermissions('admin')],
        updateBusiness);
router
    .route("/deleteBusiness")
    .post(
        [authenticateUser, authorizePermissions('admin')],
        deleteBusiness);
router
    .route("/businessList")
    .get(
        [authenticateUser, authorizePermissions('admin')],
        getBusinessList);
router
    .route("/singleBusiness")
    .post(
        [authenticateUser, authorizePermissions('admin')],
        getSingleBusiness);

module.exports = router;