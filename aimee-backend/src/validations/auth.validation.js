const Joi = require('joi');
const { password } = require('./custom.validation');
const { secret } = require("../../config.json");
const jwt = require("jsonwebtoken");
const userService = require('../services/user.service');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

/* 
token validity - 30 mins

1. token invalid - "token invalid"
2. token expired - refresh token api --- refresh token content -- same as access token
new api create - give refresh token  ( token should be expired than current value )
3. token not available 
*/
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

const tokenVerification = async (req) => {
  const { jwtDecode } = require('jwt-decode');
  let token = extractToken(req)
  let returnData = {};
  
  if (!token) { returnData.error = "Invalid Token"; return returnData; }
  try {
    const auth = await ensureAuthenticated(token);
    if (!auth) { returnData.error = "Invalid Token"; return returnData; }
    let decodedToken = jwtDecode(token);
    let loggedInUser = await userService.getById(decodedToken.sub);
    if (!loggedInUser) { returnData.error = "Invalid Token"; return returnData; }
    return returnData.loggedInUser = loggedInUser;
  }
  catch (err) {
    return "Invalid token";
  }

}

const ensureAuthenticated = async (token) => {
  if (token == undefined){return false;} 
  return await decodeToken(token);
}

function decodeToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  }
  catch (err) {
    return false;
  }

}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  tokenVerification
};
