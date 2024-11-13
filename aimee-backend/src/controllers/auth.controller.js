const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/authModel");
const { authService, tokenService } = require("../services");

const register = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    city,
    postCode,
    phone,
    photo,
    documents,
    role,
    jobTitle,
    totalHolidays,
    remainingHolidays,
    holidayDate,
    holidayReason,
    joinedDate,
    performance,
    workingHours,
    status,
    linkedinUrl,
  } = req.body;
  try {
    await userModel.createUser(
      firstName,
      lastName,
      email,
      password,
      address,
      city,
      postCode,
      phone,
      photo,
      documents,
      role,
      jobTitle,
      totalHolidays,
      remainingHolidays,
      holidayDate,
      holidayReason,
      joinedDate,
      performance,
      workingHours,
      status,
      linkedinUrl
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  register,
  login,
};
