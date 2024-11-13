import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default';
import { IRegister, IUser } from '../types/models.types';

// Generate email verification token
export async function getEmailVerificationToken(userDetails: IRegister) {
  return jwt.sign({ ...userDetails }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXP_EMAIL,
  });
}

// Generate token
export async function getToken(user: IUser) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      dob: user.dob,
      fullName: user.fullName,
      businessId: user.businessId,
      employeeId: user.employeeId,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXP,
    },
  );
}

// generate random OTP
export async function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Verify token
export async function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
}

// Check password
export async function checkPassword(password: string, passwordHash: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
}

// Check OTP
export async function checkOtp(otp: string, hashedOTP: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(otp, hashedOTP, (err, validOTP) => {
      if (err) {
        return reject(err);
      }
      resolve(validOTP);
    });
  });
}
