import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { randomBytes } from 'crypto';
import config from '../config/default';
import { prisma } from '../prisma/prisma.client';
import sendEmail, { sendOTPEmail } from './mail.function';
import { IUser, IClientInfo } from '../types/models.types';
import DeviceDetector, { DetectResult } from 'node-device-detector';

// created new detector object
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

/*----- Generate token -----*/
export const getToken = async (user: IUser) => {
  return jwt.sign({ email: user.email }, config.jwtsecret, {
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

/*----- Send General OTP -----*/
export const sendGeneralOTP = async (
  email: string,
  subject: string,
  client_info: IClientInfo | undefined,
) => {
  try {
    // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOTP = randomBytes(3).toString('hex');
    const hashedOTP = await bcrypt.hash(randomOTP, config.saltworkFactor);

    // storing hashed OTP to db
    await prisma.otp.create({
      data: {
        email,
        opt: hashedOTP,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 300000}`,
      },
    });

    // sending OTP mail
    await sendOTPEmail(email, subject, randomOTP, client_info);
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*----- Send OTP Verification Email -----*/
export const sendOTPVerificationEmail = async (
  email: string,
  client_info: IClientInfo | undefined,
) => {
  try {
    // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOTP = randomBytes(3).toString('hex');
    const hashedOTP = await bcrypt.hash(randomOTP, config.saltworkFactor);

    // storing hashed OTP to db
    await prisma.otp.create({
      data: {
        email,
        opt: hashedOTP,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 300000}`,
      },
    });

    // sending mail
    await sendEmail(email, '', randomOTP, client_info);
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*----- Verify OTP -----*/
export const verifyOtp = async (email: string, otp: string) => {
  try {
    // Check OTP
    const userOtpRecord = await prisma.otp.findFirst({
      where: { email },
    });

    if (!userOtpRecord) {
      return {
        verified: false,
        msg: `Account record doesn't exist or has been verified already. please sign up or log in.`,
      };
    }

    // user otp record exist
    const expiresAt = userOtpRecord.expiresAt;
    const hashedOTP = userOtpRecord.opt;

    if (parseInt(expiresAt) < Date.now()) {
      // user otp has expired
      await prisma.otp.deleteMany({ where: { email } });
      return {
        verified: false,
        msg: 'OTP has expired. Please please sign up or log in again.',
      };
    } else {
      const validOTP = await checkOtp(otp, hashedOTP);
      if (!validOTP) {
        // supplied otp is wrong
        return {
          verified: false,
          msg: 'Invalid OTP passed. Check your inbox.',
        };
      } else {
        // success
        await prisma.otp.deleteMany({ where: { email } });
        return {
          verified: true,
          msg: 'User Account verified successfully',
        };
      }
    }
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*------ Get Client Information ------*/
export const getClientInfo = async (req: Request) => {
  try {
    const ip = req.ip.split(':');
    const ipv4 = ip[ip.length - 1];
    const userAgent = req.get('user-agent');

    // destructure information from user-agent
    const result: DetectResult = detector.detect(userAgent as string);

    // get client location
    const response = await axios.get(`https://ipapi.co/${ipv4}/json/`);

    // client object
    const client_obj: IClientInfo = {
      ip: response?.data?.ip,
      city: response?.data?.city,
      region: response?.data?.region,
      country_name: response?.data?.country_name,
      os_name: result?.os.name,
      client_name: result?.client?.name,
      client_type: result?.client?.type,
      device_type: result?.device.type,
    };

    return client_obj;
  } catch (err) {
    console.log((err as Error).message);
  }
};
