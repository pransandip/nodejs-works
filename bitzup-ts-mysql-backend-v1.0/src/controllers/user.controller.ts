import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import config from '../config/default';
import sendEmail from '../utils/mail.function';
import { prisma } from '../prisma/prisma.client';
import { IUser, IUserPartial } from '../types/models.types';
import { checkPassword, getToken } from '../utils/utility.function';
import { sendOTPVerificationEmail } from '../utils/utility.function';

/*----- SignUp -----*/
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, country, password }: IUser = req.body;

    if (!name || !email || !phone || !country || !password) {
      throw new Error('Please provide all field');
    }

    // Check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(200).send({ message: 'User already exist' });
    }

    // Password hashed
    const hash = await bcrypt.hash(password, config.saltworkFactor);

    // Creating user
    const user = await prisma.user.create({
      data: { name, email, phone, country, password: hash },
    });

    // send OTP email verification
    await sendOTPVerificationEmail(user.id, user.email);

    // send user a token
    res.status(201).send({
      success: '1',
      message:
        'Successfully account created & OTP send to your email for login',
      email: user.email,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- LogIn -----*/
export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;

    if (!email || !password) {
      throw new Error('Please provide proper email and password');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // check verified
    if (user.isVerified === 'false') {
      await prisma.otp.deleteMany({ where: { userId: user.id } });
      // send OTP email verification
      await sendOTPVerificationEmail(user.id, user.email);
      throw new Error(
        'Account need to be verified first for login. please check your email',
      );
    }

    // check password
    const same = await checkPassword(password, user.password);

    if (same) {
      // user present
      const token = await getToken(user);
      const logUser = { ...user } as IUserPartial;
      delete logUser.password;
      res.status(201).send({
        success: '1',
        message: 'User loggedIn Successfully',
        data: { email: logUser.email, token },
      });
      return;
    }

    throw new Error('Please provide correct password');
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Reset password -----*/
export const forgotPass = async (req: Request, res: Response) => {
  const randomGenPass = randomBytes(8).toString('hex');
  try {
    const { email }: IUser = req.body;

    if (!email) {
      throw new Error('Please provide correct email Id');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // Password hashed
    const hash = await bcrypt.hash(randomGenPass, config.saltworkFactor);

    // Update user password
    const result = await prisma.user.update({
      where: { email: user.email },
      data: { password: hash },
    });

    // send user a mail
    await sendEmail(user.email, randomGenPass, '');
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
  res.status(201).json({
    success: '1',
    message: 'successfully fetched all countries',
    data: [],
  });
};
