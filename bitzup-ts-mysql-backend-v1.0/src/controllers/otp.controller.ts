import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma.client';
import { checkOtp } from '../utils/utility.function';

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp }: { email: string; otp: string } = req.body;

    if (!email || !otp) {
      throw new Error('Please provide all field');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // Check OTP
    const userOtpRecord = await prisma.otp.findFirst({
      where: { userId: user.id },
    });

    if (!userOtpRecord) {
      throw new Error(
        `Account record doesn't exist or has been verified already. please sign up or log in.`,
      );
    }

    // user otp record exist
    const expiresAt = userOtpRecord.expiresAt;
    const hashedOTP = userOtpRecord.opt;

    if (parseInt(expiresAt) < Date.now()) {
      // user otp has expired
      await prisma.otp.deleteMany({ where: { userId: user.id } });
      throw new Error(
        'Code has expired. Please please sign up or log in again.',
      );
    } else {
      const validOTP = await checkOtp(otp, hashedOTP);
      if (!validOTP) {
        // supplied otp is wrong
        throw new Error('Invalid code passed. Check your inbox.');
      } else {
        // success
        await prisma.user.update({
          where: { email: user.email },
          data: { isVerified: 'true' },
        });
        await prisma.otp.deleteMany({ where: { userId: user.id } });
        res.status(201).send({
          success: '1',
          status: 'VERIFIED',
          message: 'User Account verified successfully',
        });
      }
    }
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
