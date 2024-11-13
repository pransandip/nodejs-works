import { Request, Response } from 'express';
import { getClientInfo, sendGeneralOTP } from '../utils/utility.function';
import { prisma } from '../prisma/prisma.client';
import { IClientInfo } from '../types/models.types';

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, subject }: { email: string; subject: string } = req.body;

    if (!email || !subject) {
      throw new Error('Please provide all field');
    }

    // Check Email
    if (!email.trim().includes('@gmail.com')) {
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

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    // send OTP email
    await prisma.otp.deleteMany({ where: { email } });
    await sendGeneralOTP(email, subject, result);
    res.status(200).send({
      success: '1',
      message: 'OTP send to your email plz check',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
