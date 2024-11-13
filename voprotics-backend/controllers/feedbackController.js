const { StatusCodes } = require('http-status-codes');
const Feedback = require("../models/Feedback");
const FeedbackFile = require('../models/FeedbackFile');
const csvtojson = require("csvtojson");
const path = require("path");
const mongoose = require("mongoose");
const format = require('date-fns');
const formatISO = require('date-fns/formatISO');

const addFeedback = async (req, res) => {

    const feedbackData = await Feedback.create({
        businessId: req.user.userId,
        feedbackType: "customer",
        feedbackEntry: "manual",
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        feedback: req.body.feedback
    });

    res.status(StatusCodes.CREATED).json({ msg: 'Success! Feedback Added' });

};

const addFeedbackFromLink = async (req, res) => {

    const feedbackData = await Feedback.create({
        businessId: req.body.businessId,
        feedbackType: "customer",
        feedbackEntry: "feedbackForm",
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        feedback: req.body.feedback
    });

    res.status(StatusCodes.CREATED).json({ msg: 'Success! Feedback Added' });
}

const importFeedback = async (req, res) => {
    try {
        let reqFiles = [];
        const url = req.protocol + '://' + req.get('host')
        console.log(url)
        for (let i = 0; i < req.files.length; i++) {
            console.log(req.files[i].filename)
            reqFiles.push(url + '/public/feedbacks/' + req.files[i].filename)
        }
        console.log("csv", reqFiles);
        const uploadedFeedbacks = await FeedbackFile.create({
            businessId: req.user.userId,
            fileName: req.files[0].filename,
            filePath: reqFiles,
            feedbackType: "customer",
            feedbackEntry: "csv"
        });

        if (uploadedFeedbacks) {
            var arrayToInsert = [];
            csvtojson().fromFile(path.join(__dirname, "../public/feedbacks/", req.files[0].filename)).then(async source => {

                for (let i = 0; i < source.length; i++) {
                    console.log("-------log-----------", source[i]["entryDate"]);
                    var darr = source[i]["entryDate"].split("/");    // ["29", "1", "2016"]
                    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
                    let oneRow = {
                        businessId: req.user.userId,
                        fName: source[i]["first_name"],
                        lName: source[i]["last_name"],
                        email: source[i]["email"],
                        companyName: source[i]["company_name"],
                        jobTitle: source[i]["job_title"],
                        feedback: source[i]["feedback"],
                        fileId: uploadedFeedbacks?._id,
                        fileName: req.files[0].filename,
                        filePath: reqFiles,
                        feedbackType: "customer",
                        feedbackEntry: "csv",
                        source: source[i]["source"],
                        sentiment: source[i]["sentiment"],
                        category: source[i]["category"],
                        subcategory: source[i]["subcategory"],
                        action: source[i]["action"],
                        entryDate: dobj.toISOString(),
                        urgency: source[i]["urgency"],
                    };
                    arrayToInsert.push(oneRow);
                }

                await Feedback.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        console.log("Import CSV into database successfully");
                        res.status(StatusCodes.CREATED).json({ msg: "success", data: uploadedFeedbacks, result })
                    }
                });

            }).catch(err => {
                console.log("err", err);
            });
        }
    } catch (err) {
        console.log("err", err);
    }
}


const updateFeedback = async (req, res) => {

    const updatedFeedback = await Feedback.findOneAndUpdate({ _id: req.body.id }, {
        feedbackType: "customer",
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        feedback: req.body.feedback
    });

    res.status(StatusCodes.CREATED).json({ msg: 'Success! Feedback Updated' });

}

const getFeedbackList = async (req, res) => {
    console.log(req.body)
    var page = req.body.page;
    var limit = req.body.limit
    var skp = (page) * limit

    const feedbackList = await Feedback.find({ businessId: req.user.userId }).skip(skp).limit(limit);
    res.status(StatusCodes.OK).json({ msg: "Success! Feedback List Fetched", body: feedbackList });
}

const getFeedbackListCounts = async (req, res) => {
    try {
        await Feedback.aggregate([
            {
                $facet: {
                    "categoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $unwind: "$category" },
                        { $sortByCount: "$category" }
                    ],
                    "categoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "subcategoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" }
                    ],
                    "subcategoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "subcategoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "subcategoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },

                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "subcategoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                }
            }

        ]).then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Feedback Filtered Data Fetched", body: result })
        }).catch((err) => {
            console.log("Error", err);
        })
    } catch (err) {
        console.log("err", err);
    }
}

const getSingleFeedback = async (req, res) => {
    const singleFeedback = await Feedback.findOne({ _id: req.body.id });
    res.status(StatusCodes.OK).json({
        msg: "Success! Feedback Fetched", body: singleFeedback
    });
}

const deleteFeedback = async (req, res) => {
    const { id } = req.body;
    const deletedFeedback = await Feedback.findOneAndDelete({ _id: id });

    res.status(StatusCodes.OK).json({
        msg: "Success! Feedback Deleted"
    });
}

const categoryFilter = async (req, res) => {
    console.log("body", req.body);
    try {
        let categoryObj = {};
        let categoryArr = [];
        let subcategoryObj = {};
        let subcategoryArr = [];
        let feedbackTypeObj = {};
        let feedbackTypeArr = [];
        let feedbackEntryObj = {};
        let feedbackEntryArr = [];
        let companyNameObj = {};
        let companyNameArr = [];
        let sentimentObj = {};
        let sortingFilter = -1;
        let sentimentFilter = "";
        let filterationPeriod = req.body.filterationPeriod;
        let currentDate = new Date();
        let filterationPeriodObj = {};
        let page = req.body.page;
        let limit = req.body.limit
        let skp = (page) * limit

        if (filterationPeriod == 'lastweek') { // filter by last week

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            };
        }
        if (filterationPeriod == 'lastmonth') { // filter by last month

            let firstDayOfMonth = format.startOfMonth(currentDate);
            let subLastMonth = format.subDays(firstDayOfMonth, 1);
            let startOfMonth = format.startOfMonth(subLastMonth);
            let endOfMonth = format.endOfMonth(subLastMonth);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(startOfMonth),
                        $lte: new Date(endOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'threemonths') { // filter by 3 months

            let newDate = format.subMonths(currentDate, 3);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'twelvemonths') { // filter by 12 months

            let newDate = format.subMonths(currentDate, 12);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == '') {

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    // entryDate: {
                    //     $gte: start,
                    //     $lte: end
                    // }
                }
            }
        }

        if (req?.body?.sortFilter == 'oldest') {
            sortingFilter = 1;
            sentimentObj = {
                $match: {}
            }
        }
        if (req?.body?.sortFilter == 'newest') {
            sortingFilter = -1;
            sentimentObj = {
                $match: {}
            }
        }
        if (req?.body?.sortFilter == 'positive') {
            sentimentFilter = "Positive";
            sentimentObj = {
                $match: {
                    "sentiment": sentimentFilter
                }
            }
        }
        if (req?.body?.sortFilter == 'negative') {
            sentimentFilter = "Negative";
            sentimentObj = {
                $match: {
                    "sentiment": sentimentFilter
                }
            }
        }
        if (req?.body?.sortFilter == '') {
            sentimentFilter = "";
            sentimentObj = {
                $match: {}
            }
        }

        for (let categoryStr of req?.body?.category) {
            if (categoryStr != "") {
                categoryArr.push(categoryStr);
            }
        }
        if (categoryArr.length != 0) {
            categoryObj = {
                $match: {
                    "category": { $in: req.body.category }
                }
            }
        }
        if (categoryArr.length == 0) {
            categoryObj = {
                $match: {}
            }
        }

        for (let subcategoryStr of req?.body?.subcategory) {
            if (subcategoryStr != "") {
                subcategoryArr.push(subcategoryStr);
            }
        }
        if (subcategoryArr.length != 0) {
            subcategoryObj = {
                $match: {
                    "subcategory": { $in: req.body.subcategory }
                }
            }
        }
        if (subcategoryArr.length == 0) {
            subcategoryObj = {
                $match: {}
            }
        }

        for (let feedbackTypeStr of req?.body?.feedbackType) {
            if (feedbackTypeStr != "") {
                feedbackTypeArr.push(feedbackTypeStr);
            }
        }
        if (feedbackTypeArr.length != 0) {
            feedbackTypeObj = {
                $match: {
                    "feedbackType": { $in: req.body.feedbackType }
                }
            }
        }
        if (feedbackTypeArr.length == 0) {
            feedbackTypeObj = {
                $match: {}
            }
        }

        for (let feedbackEntryStr of req?.body?.feedbackEntry) {
            if (feedbackEntryStr != "") {
                feedbackEntryArr.push(feedbackEntryStr);
            }
        }
        if (feedbackEntryArr.length != 0) {
            feedbackEntryObj = {
                $match: {
                    "feedbackEntry": { $in: req.body.feedbackEntry }
                }
            }
        }
        if (feedbackEntryArr.length == 0) {
            feedbackEntryObj = {
                $match: {}
            }
        }

        for (let companyNameStr of req?.body?.companyName) {
            if (companyNameStr != "") {
                companyNameArr.push(companyNameStr);
            }
        }
        if (companyNameArr.length != 0) {
            companyNameObj = {
                $match: {
                    "companyName": { $in: req.body.companyName }
                }
            }
        }
        if (companyNameArr.length == 0) {
            companyNameObj = {
                $match: {}
            }
        }

        await Feedback.aggregate([
            {
                $facet: {
                    "filteredData": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        {
                            $group: {
                                "_id": {
                                    "_id": "$_id",
                                    "businessId": "$businessId",
                                    "feedbackType": "$feedbackType",
                                    "feedbackEntry": "$feedbackEntry",
                                    "fName": "$fName",
                                    "lName": "$lName",
                                    "email": "$email",
                                    "companyName": "$companyName",
                                    "jobTitle": "$jobTitle",
                                    "feedback": "$feedback",
                                    "fileId": "$fileId",
                                    "fileName": "$fileName",
                                    "filePath": "$filePath",
                                    "source": "$source",
                                    "sentiment": "$sentiment",
                                    "category": "$category",
                                    "subcategory": "$subcategory",
                                    "action": "$action",
                                    "entryDate": "$entryDate",
                                    "urgency": "$urgency",
                                },

                            }
                        },
                        {
                            $project: {
                                "_id": "$_id._id",
                                "businessId": "$_id.businessId",
                                "feedbackType": "$_id.feedbackType",
                                "feedbackEntry": "$_id.feedbackEntry",
                                "fName": "$_id.fName",
                                "lName": "$_id.lName",
                                "email": "$_id.email",
                                "companyName": "$_id.companyName",
                                "jobTitle": "$_id.jobTitle",
                                "feedback": "$_id.feedback",
                                "fileId": "$_id.fileId",
                                "fileName": "$_id.fileName",
                                "filePath": "$_id.filePath",
                                "source": "$_id.source",
                                "sentiment": "$_id.sentiment",
                                "category": "$_id.category",
                                "subcategory": "$_id.subcategory",
                                "action": "$_id.action",
                                "entryDate": "$_id.entryDate",
                                "urgency": "$_id.urgency",
                            }
                        },
                        {
                            $sort: { "entryDate": sortingFilter }
                        },
                        {
                            $skip: skp
                        },
                        {
                            $limit: limit
                        }
                    ],
                }
            }

        ]).then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Feedback Filtered Data Fetched", body: result })
        }).catch((err) => {
            console.log("Error", err);
        })

    } catch (err) {
        console.log("err", err);
    }
}

// const filteredData = await Feedback.find({
//     businessId: req.user.userId,
//     $and: [
//         filterationPeriodObj,
//         categoryObj,
//         subcategoryObj,
//         feedbackTypeObj,
//         feedbackEntryObj,
//         companyNameObj,
//         sentimentObj
//     ],
// })
//     .sort({ createdAt: sortingFilter })
// res.status(StatusCodes.OK).json({
//     msg: "Success! Feedback Filtered Data Fetched", body: filteredData
// });

const categoryFilteredCounts = async (req, res) => {
    try {
        let categoryObj = {};
        let categoryArr = [];
        let subcategoryObj = {};
        let subcategoryArr = [];
        let feedbackTypeObj = {};
        let feedbackTypeArr = [];
        let feedbackEntryObj = {};
        let feedbackEntryArr = [];
        let companyNameObj = {};
        let companyNameArr = [];
        let sentimentObj = {};
        let sortingFilter = -1;
        let sentimentFilter = "";
        let filterationPeriod = req.body.filterationPeriod;
        let currentDate = new Date();
        let filterationPeriodObj = {};

        if (filterationPeriod == 'lastweek') { // filter by last week

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            };
        }
        if (filterationPeriod == 'lastmonth') { // filter by last month

            let firstDayOfMonth = format.startOfMonth(currentDate);
            let subLastMonth = format.subDays(firstDayOfMonth, 1);
            let startOfMonth = format.startOfMonth(subLastMonth);
            let endOfMonth = format.endOfMonth(subLastMonth);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(startOfMonth),
                        $lte: new Date(endOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'threemonths') { // filter by 3 months

            let newDate = format.subMonths(currentDate, 3);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'twelvemonths') { // filter by 12 months

            let newDate = format.subMonths(currentDate, 12);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == '') {

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    // entryDate: {
                    //     $gte: start,
                    //     $lte: end
                    // }
                }
            }
        }

        if (req?.body?.sortFilter == 'oldest') {
            sortingFilter = 1;
            sentimentObj = {
                $match: {}
            }
        }
        if (req?.body?.sortFilter == 'newest') {
            sortingFilter = -1;
            sentimentObj = {
                $match: {}
            }
        }
        if (req?.body?.sortFilter == 'positive') {
            sentimentFilter = "Positive";
            sentimentObj = {
                $match: {
                    "sentiment": sentimentFilter
                }
            }
        }
        if (req?.body?.sortFilter == 'negative') {
            sentimentFilter = "Negative";
            sentimentObj = {
                $match: {
                    "sentiment": sentimentFilter
                }
            }
        }
        if (req?.body?.sortFilter == '') {
            sentimentFilter = "";
            sentimentObj = {
                $match: {}
            }
        }

        for (let categoryStr of req?.body?.category) {
            if (categoryStr != "") {
                categoryArr.push(categoryStr);
            }
        }
        if (categoryArr.length != 0) {
            categoryObj = {
                $match: {
                    "category": { $in: req.body.category }
                }
            }
        }
        if (categoryArr.length == 0) {
            categoryObj = {
                $match: {}
            }
        }

        for (let subcategoryStr of req?.body?.subcategory) {
            if (subcategoryStr != "") {
                subcategoryArr.push(subcategoryStr);
            }
        }
        if (subcategoryArr.length != 0) {
            subcategoryObj = {
                $match: {
                    "subcategory": { $in: req.body.subcategory }
                }
            }
        }
        if (subcategoryArr.length == 0) {
            subcategoryObj = {
                $match: {}
            }
        }

        for (let feedbackTypeStr of req?.body?.feedbackType) {
            if (feedbackTypeStr != "") {
                feedbackTypeArr.push(feedbackTypeStr);
            }
        }
        if (feedbackTypeArr.length != 0) {
            feedbackTypeObj = {
                $match: {
                    "feedbackType": { $in: req.body.feedbackType }
                }
            }
        }
        if (feedbackTypeArr.length == 0) {
            feedbackTypeObj = {
                $match: {}
            }
        }

        for (let feedbackEntryStr of req?.body?.feedbackEntry) {
            if (feedbackEntryStr != "") {
                feedbackEntryArr.push(feedbackEntryStr);
            }
        }
        if (feedbackEntryArr.length != 0) {
            feedbackEntryObj = {
                $match: {
                    "feedbackEntry": { $in: req.body.feedbackEntry }
                }
            }
        }
        if (feedbackEntryArr.length == 0) {
            feedbackEntryObj = {
                $match: {}
            }
        }

        for (let companyNameStr of req?.body?.companyName) {
            if (companyNameStr != "") {
                companyNameArr.push(companyNameStr);
            }
        }
        if (companyNameArr.length != 0) {
            companyNameObj = {
                $match: {
                    "companyName": { $in: req.body.companyName }
                }
            }
        }
        if (companyNameArr.length == 0) {
            companyNameObj = {
                $match: {}
            }
        }

        await Feedback.aggregate([
            {
                $facet: {
                    "filteredCategoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        { $unwind: "$category" },
                        { $sortByCount: "$category" }
                    ],
                    "categoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "filteredSubcategoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" }
                    ],
                    "filteredSubcategoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                }
            }

        ]).then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Feedback Filtered Data Fetched", body: result })
        }).catch((err) => {
            console.log("Error", err);
        })

    } catch (err) {
        console.log("err", err);
    }
}

const getAnalytics = async (req, res) => {

    try {
        let categoryObj = {};
        let categoryArr = [];
        let subcategoryObj = {};
        let subcategoryArr = [];
        let feedbackTypeObj = {};
        let feedbackTypeArr = [];
        let feedbackEntryObj = {};
        let feedbackEntryArr = [];
        let companyNameObj = {};
        let companyNameArr = [];
        let sentimentObj = {};
        let filterationPeriod = req.body.filterationPeriod;
        let currentDate = new Date();
        let filterationPeriodObj = {};

        console.log("body", req.body);

        if (filterationPeriod == 'lastweek') { // filter by last week

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            };
        }
        if (filterationPeriod == 'lastmonth') { // filter by last month

            let firstDayOfMonth = format.startOfMonth(currentDate);
            let subLastMonth = format.subDays(firstDayOfMonth, 1);
            let startOfMonth = format.startOfMonth(subLastMonth);
            let endOfMonth = format.endOfMonth(subLastMonth);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(startOfMonth),
                        $lte: new Date(endOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'threemonths') { // filter by 3 months

            let newDate = format.subMonths(currentDate, 3);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == 'twelvemonths') { // filter by 12 months

            let newDate = format.subMonths(currentDate, 12);
            let startOfMonth = format.startOfMonth(newDate);
            let newDayOfMonth = format.addDays(startOfMonth, 1);
            let firstDayOfMonth = format.startOfMonth(currentDate);

            filterationPeriodObj = {
                $match: {
                    entryDate: {
                        $gte: new Date(newDayOfMonth),
                        $lte: new Date(firstDayOfMonth)
                    }
                }
            };
        }
        if (filterationPeriod == '') {

            let lastWeekDate = format.subDays(currentDate, 7)
            let start = format.startOfISOWeek(lastWeekDate);
            let end = format.endOfISOWeek(lastWeekDate);

            filterationPeriodObj = {
                $match: {
                    // entryDate: {
                    //     $gte: start,
                    //     $lte: end
                    // }
                }
            }
        }


        if (req?.body?.sentiment == 'Positive') {
            sentimentObj = {
                $match: {
                    "sentiment": req?.body?.sentiment
                }
            }
        }
        if (req?.body?.sentiment == 'Negative') {
            sentimentObj = {
                $match: {
                    "sentiment": req?.body?.sentiment
                }
            }
        }
        if (req?.body?.sentiment == 'Neutral') {
            sentimentObj = {
                $match: {
                    "sentiment": req?.body?.sentiment
                }
            }
        }
        if (req?.body?.sentiment == '') {
            sentimentObj = {
                $match: {}
            }
        }

        for (let categoryStr of req?.body?.category) {
            if (categoryStr != "") {
                categoryArr.push(categoryStr);
            }
        }
        if (categoryArr.length != 0) {
            categoryObj = {
                $match: {
                    "category": { $in: req.body.category }
                }
            }
        }
        if (categoryArr.length == 0) {
            categoryObj = {
                $match: {}
            }
        }

        for (let subcategoryStr of req?.body?.subcategory) {
            if (subcategoryStr != "") {
                subcategoryArr.push(subcategoryStr);
            }
        }
        if (subcategoryArr.length != 0) {
            subcategoryObj = {
                $match: {
                    "subcategory": { $in: req.body.subcategory }
                }
            }
        }
        if (subcategoryArr.length == 0) {
            subcategoryObj = {
                $match: {}
            }
        }

        for (let feedbackTypeStr of req?.body?.feedbackType) {
            if (feedbackTypeStr != "") {
                feedbackTypeArr.push(feedbackTypeStr);
            }
        }
        if (feedbackTypeArr.length != 0) {
            feedbackTypeObj = {
                $match: {
                    "feedbackType": { $in: req.body.feedbackType }
                }
            }
        }
        if (feedbackTypeArr.length == 0) {
            feedbackTypeObj = {
                $match: {}
            }
        }

        for (let feedbackEntryStr of req?.body?.feedbackEntry) {
            if (feedbackEntryStr != "") {
                feedbackEntryArr.push(feedbackEntryStr);
            }
        }
        if (feedbackEntryArr.length != 0) {
            feedbackEntryObj = {
                $match: {
                    "feedbackEntry": { $in: req.body.feedbackEntry }
                }
            }
        }
        if (feedbackEntryArr.length == 0) {
            feedbackEntryObj = {
                $match: {}
            }
        }

        for (let companyNameStr of req?.body?.companyName) {
            if (companyNameStr != "") {
                companyNameArr.push(companyNameStr);
            }
        }
        if (companyNameArr.length != 0) {
            companyNameObj = {
                $match: {
                    "companyName": { $in: req.body.companyName }
                }
            }
        }
        if (companyNameArr.length == 0) {
            companyNameObj = {
                $match: {}
            }
        }

        await Feedback.aggregate([
            {
                $facet: {
                    "filteredData": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        {
                            $group: {
                                "_id": {
                                    "_id": "$_id",
                                    "businessId": "$businessId",
                                    "feedbackType": "$feedbackType",
                                    "feedbackEntry": "$feedbackEntry",
                                    "fName": "$fName",
                                    "lName": "$lName",
                                    "email": "$email",
                                    "companyName": "$companyName",
                                    "jobTitle": "$jobTitle",
                                    "feedback": "$feedback",
                                    "fileId": "$fileId",
                                    "fileName": "$fileName",
                                    "filePath": "$filePath",
                                    "source": "$source",
                                    "sentiment": "$sentiment",
                                    "category": "$category",
                                    "subcategory": "$subcategory",
                                    "action": "$action",
                                    "entryDate": "$entryDate",
                                    "urgency": "$urgency",
                                },

                            }
                        },
                        {
                            $project: {
                                "_id": "$_id._id",
                                "businessId": "$_id.businessId",
                                "feedbackType": "$_id.feedbackType",
                                "feedbackEntry": "$_id.feedbackEntry",
                                "fName": "$_id.fName",
                                "lName": "$_id.lName",
                                "email": "$_id.email",
                                "companyName": "$_id.companyName",
                                "jobTitle": "$_id.jobTitle",
                                "feedback": "$_id.feedback",
                                "fileId": "$_id.fileId",
                                "fileName": "$_id.fileName",
                                "filePath": "$_id.filePath",
                                "source": "$_id.source",
                                "sentiment": "$_id.sentiment",
                                "category": "$_id.category",
                                "subcategory": "$_id.subcategory",
                                "action": "$_id.action",
                                "entryDate": "$_id.entryDate",
                                "urgency": "$_id.urgency",
                            }
                        },                        
                    ],
                    "dateDistribustion": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        {
                            $sort: { "createdAt": -1 }
                        },
                        {
                            $group: {
                                "_id": {
                                    "_id": "$_id",
                                    "entryDate": "$entryDate",
                                },

                            }
                        },
                        {
                            $project: {
                                "entryDate": "$_id.entryDate",
                                year: { $year: "$_id.entryDate" },
                                month: { $month: "$_id.entryDate" },
                                day: { $dayOfMonth: "$_id.entryDate" },
                                hour: { $hour: "$_id.entryDate" },
                                minutes: { $minute: "$_id.entryDate" },
                                seconds: { $second: "$_id.entryDate" },
                                milliseconds: { $millisecond: "$_id.entryDate" },
                                dayOfYear: { $dayOfYear: "$_id.entryDate" },
                                dayOfWeek: { $dayOfWeek: "$_id.entryDate" },
                                week: { $week: "$_id.entryDate" }
                            }
                        }
                    ],
                    "filteredCategoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        { $unwind: "$category" },
                        { $sortByCount: "$category" }
                    ],
                    "categoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "categoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$category" },
                        { $sortByCount: "$category" },
                    ],
                    "filteredSubcategoryCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        sentimentObj,
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" }
                    ],
                    "filteredSubcategoryPositiveSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Positive" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryNegativeSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Negative" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryNeutralSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        { $match: { sentiment: "Neutral" } },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                    "filteredSubcategoryTotalSentimentCount": [
                        {
                            $match: {
                                "businessId": new mongoose.Types.ObjectId(req.user.userId)
                            }
                        },
                        filterationPeriodObj,
                        categoryObj,
                        subcategoryObj,
                        feedbackTypeObj,
                        feedbackEntryObj,
                        companyNameObj,
                        {
                            $match: {
                                "sentiment": { $in: ['Positive', 'Negative', 'Neutral'] }
                            }
                        },
                        { $unwind: "$subcategory" },
                        { $sortByCount: "$subcategory" },
                    ],
                }
            }

        ]).then(result => {
            res.status(StatusCodes.OK).json({ msg: "Success! Feedback Filtered Data Fetched", body: result })
        }).catch((err) => {
            console.log("Error", err);
        })
    } catch (err) {
        console.log("Error", err);
    }

}

module.exports = {
    addFeedback,
    addFeedbackFromLink,
    getFeedbackList,
    getSingleFeedback,
    getFeedbackListCounts,
    deleteFeedback,
    updateFeedback,
    importFeedback,
    categoryFilter,
    categoryFilteredCounts,
    getAnalytics
}
