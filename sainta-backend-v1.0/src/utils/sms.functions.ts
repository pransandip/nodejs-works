import bcrypt from 'bcrypt';
import { Twilio } from 'twilio';
import config from '../config/default';
import { checkOtp } from './utility.functions';
import { prisma } from '../prisma/prisma.client';

/*----- SMS handler -----*/
export async function sendSMS(otp: string, phone: string, sub: string) {
  const client = new Twilio(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN,
  );

  const response = client.messages
    .create({
      body: `OTP for ${sub} is: ${otp} (valid for 5 mins). Do not share with anyone. -Sainta`,
      from: config.TWILIO_PHONE_NO,
      to: phone,
    })
    .then(message => {
      console.log(message);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });

  return response;
}

// send OTP to phone
export async function sendOTP(
  email: string,
  phone: string,
  sub: string = 'Mobile verification',
) {
  try {
    const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    console.log({ randomOTP });

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
}

// verify OTP
export async function verifyOtp(email: string, otp: string) {
  try {
    // check otp first
    const otpRecord = await prisma.otp.findFirst({ where: { email } });

    // opt record not present
    if (!otpRecord) {
      return {
        verified: false,
        msg: `Account record doesn't exist or has been verified already. please sign up or log in.`,
      };
    }

    // if user otp record exist
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
}
