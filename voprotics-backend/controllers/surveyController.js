const { StatusCodes } = require('http-status-codes');
const Survey = require("../models/Survey");
const mongoose = require("mongoose");

const postSurvey = async (req, res) => {
    const surveyData = await Survey.create({ 
        businessId: req.user.userId,
        surveyData: req.body });
    console.log("surveyData", surveyData);
    res.status(StatusCodes.CREATED).json({ msg: "Success! Survey Created" }); 
}

const getSurveyList = async (req, res) => {
    const surveyList = await Survey.find({ businessId: req.user.userId });
    console.log("surveyList", surveyList);
    res.status(StatusCodes.OK).json({ msg: "Success! Survey List Fetched", body: surveyList });
}

const updateSurvey = async (req, res) => {
    const survey = await Survey.findOneAndUpdate({ businessId: req.user.userId, _id: req.body.id }, { surveyData: req.body });
    console.log("survey", survey);
    res.status(StatusCodes.OK).json({ msg: "Success! Survey Updated" });
}

const getSingleSurvey = async (req, res) => {
    const survey = await Survey.findOne({ businessId: req.user.userId, _id: req.body.id });
    console.log("survey", survey);
    res.status(StatusCodes.OK).json({ msg: "Success! Survey Fetched", body: survey });
}

const deleteSurvey = async (req, res) => {
    const survey = await Survey.findOneAndDelete({ businessId: req.user.userId, _id: req.body.id });
    console.log("survey", survey);
    res.status(StatusCodes.OK).json({ msg: "Success! Survey Deleted" });
}

module.exports = {
    postSurvey,
    getSurveyList,
    updateSurvey,
    getSingleSurvey,
    deleteSurvey
}