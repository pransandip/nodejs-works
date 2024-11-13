import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma.client';
import { sendPhoneOTP } from '../utils/utility.function';

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, subject }: { email: string; subject: string } = req.body;

    if (!email || !subject) {
      throw new Error('Please provide all field');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // check user
    const exist = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!exist) {
      throw new Error('User not found with this email Id');
    }

    // send OTP to client
    await prisma.otp.deleteMany({ where: { email } });

    // send SMS
    const send = await sendPhoneOTP(email, exist.phone, subject);

    // OTP not send
    if (!send) {
      throw new Error('OTP Not send.. some issue occurred, while sending OTP');
    }

    res.status(200).send({
      success: '1',
      message: 'OTP send to your registered mobile plz check',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
