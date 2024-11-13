const express = require('express');
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');
const {
    addFeedback,
    addFeedbackFromLink,
    getFeedbackList,
    getFeedbackListCounts,
    getSingleFeedback,
    deleteFeedback,
    updateFeedback,
    importFeedback,
    categoryFilter,
    categoryFilteredCounts,
    getAnalytics
} = require("../controllers");
const { uploadMulti } = require('../utils/uploadFeedback');

const router = express.Router();

router.route("/addFeedbackFromLink").post(addFeedbackFromLink);

router.route("/addFeedback").post(authenticateUser, addFeedback);
router.route("/getFeedbackList").post(authenticateUser, getFeedbackList);
router.route("/getFeedbackListCounts").get(authenticateUser, getFeedbackListCounts);
router.route("/getSingleFeedback").post(authenticateUser, getSingleFeedback);
router.route("/deleteFeedback").post(authenticateUser, deleteFeedback);
router.route("/updateFeedback").patch(authenticateUser, updateFeedback);
router.route('/addFeedbackList').post(
    [authenticateUser, uploadMulti.array('multiFile', 10)],
    importFeedback);
router.route("/filteredFeedbacks").post(authenticateUser, categoryFilter);
router.route("/categoryFilteredCounts").post(authenticateUser, categoryFilteredCounts);
router.route("/getAnalytics").post(authenticateUser, getAnalytics);

module.exports = router;