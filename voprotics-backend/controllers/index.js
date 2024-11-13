const {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require("./authController");

const {
    homeController
} = require("./homeController");

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
} = require("./userController");

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
} = require("./feedbackController");

const {
    postSurvey,
    getSurveyList,
    updateSurvey,
    getSingleSurvey,
    deleteSurvey
} = require("./surveyController");
 
const {
    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessList,
    getSingleBusiness,    
 } = require("./adminController");

module.exports = {

    homeController,

    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,    

    showCurrentUser,
    updateUser,
    updateUserPassword,
    getSingleUser,
    
    bookDemo,
    getDemoList,
    
    createPayment,

    createSubscription,
    getSubscription,
    createSubscriptionPayment,

    sendMail,

    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessList,
    getSingleBusiness,

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
    getAnalytics,

    postSurvey,
    getSurveyList,
    updateSurvey,
    getSingleSurvey,
    deleteSurvey,

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
}
