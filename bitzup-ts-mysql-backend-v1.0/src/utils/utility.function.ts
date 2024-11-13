import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default';
import { IUser } from '../types/models.types';
import { prisma } from '../prisma/prisma.client';
import sendEmail from './mail.function';

/*----- Generate token -----*/
export const getToken = async (user: IUser) => {
  return jwt.sign({ id: user.id }, config.jwtsecret, {
    expiresIn: config.jwtExp,
  });
};

/*----- Verify token -----*/
export const verifyToken = async (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtsecret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

/*----- Check OTP -----*/
export const checkOtp = (otp: string, hashedOTP: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(otp, hashedOTP, (err, validOTP) => {
      if (err) {
        reject(err);
      }

      resolve(validOTP);
    });
  });
};

/*----- Check password -----*/
export const checkPassword = async (password: string, passwordHash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        reject(err);
      }
      resolve(same);
    });
  });
};

/*----- Send OTP Verification Email -----*/
export const sendOTPVerificationEmail = async (
  userId: string,
  email: string,
) => {
  try {
    const randomOTP = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(randomOTP, config.saltworkFactor);

    // storing hashed OTP to db
    await prisma.otp.create({
      data: {
        userId,
        opt: hashedOTP,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 3600000}`,
      },
    });

    // sending mail
    await sendEmail(email, '', randomOTP);
  } catch (err) {
    console.log((err as Error).message);
  }
};
