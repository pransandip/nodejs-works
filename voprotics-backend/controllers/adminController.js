const User = require("../models/User");
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const Demo = require("../models/Demo");

const addBusiness = async (req, res) => {
    const { email, name, phone, password } = req.body;
    console.log("regUser", { email, name, password });
    const emailAlreadyExists = await User.findOne({ email });
    console.log("emailAlreadyExists", emailAlreadyExists)
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }
    const demoUser = await Demo.findOne({ email });
    console.log("demoUser", demoUser);
    if (!demoUser) {
        throw new CustomError.BadRequestError('Demo user not found!');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: "user",
        isVerified: true,
        verificationToken: "",
        buyerId: demoUser?._id
    });

    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Business Added',
    });
}

const updateBusiness = async (req, res) => {
    const { email, name, phone, id } = req.body;
    console.log("updateUser", req.body);
    if (!email || !name || !phone) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: id });

    user.email = email;
    user.name = name;
    user.phone = phone

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: "Success! Business Updated"
    });
}

const deleteBusiness = async (req, res) => {
    const { id } = req.body;
    const deletedUser = await User.findOneAndDelete({ _id: id });

    res.status(StatusCodes.OK).json({
        msg: "Success! Business Deleted"
    });
}

const getBusinessList = async (req, res) => {
    const businessList = await User.find({});
    res.status(StatusCodes.OK).json({
        msg: "Success! Business List Fetched", body: businessList
    });
}

const getSingleBusiness = async (req, res) => {
    const singleBusiness = await User.findOne({ _id: req.body.id });
    res.status(StatusCodes.OK).json({
        msg: "Success! Business Fetched", body: singleBusiness
    });
}

module.exports = {
    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessList,
    getSingleBusiness
}