require("dotenv").config();
require('express-async-errors');

const format = require('date-fns');
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require("path");
const morgan = require("morgan");
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require("compression");

const connectDB = require("./db/connect");

const {
    authRouter,
    homeRoute,
    userRouter,
    adminRouter,
    feedbackRouter,
    surveyRouter
} = require("./routes/index");

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL;
const MONGO_URI_ATLAS = process.env.MONGO_URI_ATLAS;
const MONGO_URI_AWS = process.env.MONGO_URI_AWS;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/public/contacts", express.static(path.join(__dirname, "public/contacts")));
app.use("/public/videos", express.static(path.join(__dirname, "public/videos")));
app.use("/public/images", express.static(path.join(__dirname, "public/images")));
app.use("/public/feedbacks", express.static(path.join(__dirname, "public/feedbacks")));
app.use("/public/assests/images", express.static(path.join(__dirname, "public/assests/images")));

app.use("/", homeRoute);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use("/admin", adminRouter);
app.use("/feedback", feedbackRouter);
app.use("/survey", surveyRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception..... 💣 🔥 stopping the server....");
    console.log(error.name, error.message);

    process.exit(1);
});

connectDB(MONGO_URI_AWS);

app.listen(PORT || 5001, () => {
    console.log(`listening on ${PORT} with ${process.pid}`);
});

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection..... 💣 🔥 stopping the server....");
    console.log(error.name, error.message);
    server.close(() => {
        // exit code 1 means that there is an issue that caused the program to exit
        process.exit(1);
    });
});