const authRouter = require("./authRoutes");
const homeRoute = require("./homeRoute");
const userRouter = require("./userRoutes");
const adminRouter = require("./adminRoutes");
const feedbackRouter = require("./feedbackRoutes");
const surveyRouter = require("./surveyRoutes");

module.exports = {
    authRouter,
    homeRoute,
    userRouter,
    adminRouter,
    feedbackRouter,
    surveyRouter
}