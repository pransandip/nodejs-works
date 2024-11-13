require("dotenv").config();
const jwt = require('jwt-simple');
const SECRETKEY = "D5\x12\x03\xaa\xe6\x97\xe6\x1b\x9cjT~\x0c\x1f\xffg\xe1O\xef\xbeL\xc6\n";
const crypto = require('crypto');



const encodeToken = async (user, time) => {
    let expiry = 1;
    if (user?.userName) expiry = 30;
    const payload = {
      exp: moment().add(expiry, 'days').unix(),
      iat: moment().unix(),
      sub: user.id
    }
    payload.user = user;
    if (!user.id)
      payload.sub = user.id;
    if (time)
      payload.timeLogin = time;
    return jwt.encode(payload, SECRETKEY)
  }

  const encrypt = async (text) => {
    var key = "abcdefghijklmnopqrstuvwx";
    var encrypt = crypto.createCipheriv('des-ede3', key, "");
    var theCipher = encrypt.update(text, 'utf8', 'base64');
    var returndata = theCipher += encrypt.final('base64');
    return returndata;
  }

  const decrypt = async (encryptedText) => {
    var key = "abcdefghijklmnopqrstuvwx";
    var decrypt = crypto.createDecipheriv('des-ede3', key, "");
    var s = decrypt.update(encryptedText, 'base64', 'utf8');
    var returndata = s + decrypt.final('utf8');
    return returndata;
  }

  module.exports = {
    encodeToken,
    encrypt,
    decrypt
  }