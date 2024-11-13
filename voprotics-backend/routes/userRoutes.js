const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');
const {
    showCurrentUser,
    updateUser,
    updateUserPassword,
    bookDemo,
    getDemoList,
    getSingleUser,
    createPayment,
    createSubscription,
    getSubscription,
    createSubscriptionPayment,
    sendMail,
    importContacts,
    getBusinessContacts,
    addContact,
    deleteContact,
    getSingleContact,
    updateContact,
    addTestimonialForm,
    getAllTestimonies,
    getSingleTestimony,
    uploadTestimonialVideo,
    uploadTestimoniaText,
    getVideoTestimonyList,
    deleteTestimonialForm,
    updateTestimonialForm,
    getTextTestimonialList,
    getSingleTestimonialVideo
} = require("../controllers");
const { uploadMulti } = require("../utils/uploadMulti");
const { uploadVideo } = require("../utils/uploadVideo");
const { uploadImage } = require("../utils/uploadImage");

router.route("/bookDemo").post(bookDemo);
router.route("/createPayment").post(createPayment);
router.route("/createSubscription").post(createSubscription);
router.route("/createSubscriptionPayment").post(createSubscriptionPayment);

router.route('/showMe').get(
    authenticateUser,
    showCurrentUser);
router.route('/updateUser').patch(
    authenticateUser,
    updateUser);
router.route('/updateUserPassword').patch(
    authenticateUser,
    updateUserPassword);
router.route('/singleUser').get(
    authenticateUser,
    getSingleUser);

router.route('/getSubscription').get(
    authenticateUser,
    getSubscription);
router.route('/sendMail').post(
    authenticateUser,
    sendMail);

router.route('/addContacts').post(
    [authenticateUser, uploadMulti.array('multiFile', 10)],
    importContacts);
router.route('/addContact').post(
    authenticateUser,
    addContact);
router.route('/getContacts').post(
    authenticateUser,
    getBusinessContacts);
router.route('/deleteContact').post(
    authenticateUser,
    deleteContact);
router.route('/getSingleContact').post(
    authenticateUser,
    getSingleContact);
router.route('/updateContact').patch(
    authenticateUser,
    updateContact);

router.route('/addTestimonialForm').post(
    [authenticateUser, uploadImage.single("image")],
    addTestimonialForm);
router.route('/testimonies').get(
    authenticateUser,
    getAllTestimonies);
router.route('/singleTestimony').post(
    getSingleTestimony);
router.route('/testimonialVideo').post(
    uploadVideo.single('video'),
    uploadTestimonialVideo);
router.route('/testimonialText').post(
    uploadImage.single('image'),
    uploadTestimoniaText);
router.route('/testimonialVideoList').post(
    authenticateUser,
    getVideoTestimonyList);
router.route('/deleteTestimonialForm').post(
    authenticateUser,
    deleteTestimonialForm);
router.route('/updateTestimonialForm').patch(
    [authenticateUser, uploadImage.single("image")],
    updateTestimonialForm);
router.route('/getTextTestimonialList').get(
    authenticateUser,
    getTextTestimonialList);
router.route('/getSingleTestimonialVideo').post(
    authenticateUser,
    getSingleTestimonialVideo);

router
    .route("/demoList")
    .get(
        [authenticateUser, authorizePermissions('admin')],
        getDemoList);

module.exports = router;