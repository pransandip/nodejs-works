import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default';
import { prisma } from '../prisma/prisma.client';
import { IUser } from '../types/models.types';
import { sendSMS } from './sms.function';

/*----- Generate email verification token -----*/
export const getEmailVerificationToken = async ({
  email,
  username,
  phone,
  password,
  link = '',
  bio = '',
  city = '',
  firstname = '',
  lastname = '',
  userType = 'Regular' || 'Mode',
  image = '',
}: IUser) => {
  return jwt.sign(
    {
      email,
      username,
      phone,
      password,
      link,
      bio,
      city,
      firstname,
      lastname,
      userType,
      image,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXP_EMAIL,
    },
  );
};

/*----- Generate token -----*/
export const getToken = async (user: IUser) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      image: user.image,
      bio: user.bio,
      link: user.link,
      userType: user.userType,
      city: user.city,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt?.toISOString(),
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXP,
    },
  );
};

/*----- Verify token -----*/
export const verifyToken = async (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

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

/*----- Verify OTP -----*/
export const verifyOtp = async (email: string, otp: string) => {
  try {
    // Check OTP
    const otpRecord = await prisma.otp.findFirst({ where: { email } });

    // opt record not present
    if (!otpRecord) {
      return {
        verified: false,
        msg: `Account record doesn't exist or has been verified already. please sign up or log in.`,
      };
    }

    // user otp record exist
    const expiresAt = otpRecord.expiresAt;
    const hashedOTP = otpRecord.opt;

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

/*----- Send OTP to Phone -----*/
export const sendPhoneOTP = async (
  email: string,
  phone: string,
  sub: string = 'Mobile verification',
) => {
  try {
    const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(randomOTP);
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
    // sending OTP through SMS
    const send = await sendSMS(randomOTP, phone, sub);
    return send;
  } catch (err) {
    console.log((err as Error).message);
  }
};
