import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import config from '../config/default';
import sendEmail from '../utils/mail.function';
import { prisma } from '../prisma/prisma.client';
import { IClientInfo, IUser, IUserPartial } from '../types/models.types';
import { checkPassword, getToken } from '../utils/utility.function';
import {
  sendOTPVerificationEmail,
  verifyOtp,
  getClientInfo,
} from '../utils/utility.function';

/*----- SignUp -----*/
export const signUp = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      country_code,
      password,
      otp_verify,
      otp,
    }: IUser = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !country_code ||
      !password ||
      !otp_verify
    ) {
      throw new Error('Please provide all field');
    }

    // Check country
    const country = await prisma.countries.findFirst({
      where: { phonecode: country_code },
    });
    if (!country) {
      throw new Error('Country code invalid');
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // Check Phone
    if (typeof parseInt(phone) !== 'string' && phone.trim().length !== 10) {
      throw new Error('Please provide valid phone number');
    }

    // check password
    if (password.length < 6) {
      throw new Error(
        'Password is too short! password must be min 6 char long',
      );
    }

    // Check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res
        .status(200)
        .send({ success: '0', message: 'User already exist' });
    }

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    if (otp_verify === 'No') {
      await prisma.otp.deleteMany({ where: { email } });
      // send OTP email verification
      await sendOTPVerificationEmail(email, result);
      res.status(200).send({
        success: '1',
        message: 'OTP send to your email plz check',
      });
      return;
    }

    if (!otp) {
      throw new Error('Please provide otp first');
    }

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      throw new Error(verifyOTP?.msg);
    }

    // Password hashed
    const hash = await bcrypt.hash(password, config.saltworkFactor);

    // Creating user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        country: country_code,
        password: hash,
      },
    });

    // update user verified
    // await prisma.user.update({
    //   where: { email: user.email },
    //   data: { isVerified: 'true' },
    // });

    // send user a token
    const token = await getToken(user);

    await prisma.user.update({
      where: { email: user.email },
      data: { token },
    });

    res.status(201).send({
      success: '1',
      message: 'Successfully account created',
      email: user.email,
      token,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- LogIn -----*/
export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password, otp_verify, otp }: IUser = req.body;

    if (!email || !password || !otp_verify) {
      throw new Error('Please provide all field');
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // check password
    if (password.length < 6) throw new Error('Password is too short!');

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // check password
    const same = await checkPassword(password, user.password);

    if (!same) {
      throw new Error('Please provide correct password');
    }

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    // check verified
    if (otp_verify === 'No') {
      await prisma.otp.deleteMany({ where: { email } });
      // send OTP email verification
      await sendOTPVerificationEmail(email, result);
      res.status(200).send({
        success: '1',
        message:
          'Account need to be verified first for login. please check your email',
      });
      return;
    }

    if (!otp) {
      throw new Error('Please provide otp first');
    }

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      throw new Error(verifyOTP?.msg);
    }

    // delete password from user object
    const logUser = { ...user } as IUserPartial;
    delete logUser.password;

    res.status(201).send({
      success: '1',
      message: 'User loggedIn Successfully',
      data: { email: logUser.email, token: logUser.token },
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Reset password -----*/
export const forgotPass = async (req: Request, res: Response) => {
  const randomGenPass = randomBytes(8).toString('hex');
  try {
    const { email, otp }: IUser = req.body;

    if (!email || !otp) {
      throw new Error('Please provide all field');
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      throw new Error(verifyOTP?.msg);
    }

    // Password hashed
    const hash = await bcrypt.hash(randomGenPass, config.saltworkFactor);

    // Update user password
    const result = await prisma.user.update({
      where: { email: user.email },
      data: { password: hash },
    });

    // get client information
    const client_info: IClientInfo | undefined = await getClientInfo(req);

    // send user a mail
    await sendEmail(user.email, randomGenPass, '', client_info);
    res.status(201).json({
      success: '1',
      message: 'Please Check Your Registered Email',
      email: result.email,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Get Country List  -----*/
export const getAllCountries = async (_req: Request, res: Response) => {
  try {
    // get client information
    // const result: IClientInfo | undefined = await getClientInfo(req);
    // console.log(result);

    const countries = await prisma.countries.findMany({
      select: {
        name: true,
        phonecode: true,
      },
    });
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all countries',
      data: countries,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
