const express = require('express');
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');
const {
    postSurvey,
    getSurveyList,
    updateSurvey,
    getSingleSurvey,
    deleteSurvey
} = require("../controllers");

const router = express.Router();

router.route('/postSurvey').post(
    authenticateUser,
    postSurvey);
router.route('/getSurveyList').get(
    authenticateUser,
    getSurveyList);
router.route('/updateSurvey').patch(
    authenticateUser,
    updateSurvey);
router.route('/getSingleSurvey').post(
    authenticateUser,
    getSingleSurvey);
router.route('/deleteSurvey').post(
    authenticateUser,
    deleteSurvey);

module.exports = router;