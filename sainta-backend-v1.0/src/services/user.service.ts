import bcrypt from 'bcrypt';
import {
  getToken,
  verifyToken,
  getEmailVerificationToken,
} from '../utils/utility.functions';
import config from '../config/default';
import { ILogin } from '../types/models.types';
import { prisma } from '../prisma/prisma.client';
import { sendOTP, verifyOtp } from '../utils/sms.functions';
import { CreateUserDto } from '../types/dtos/CreateUser.dto';
import { sendVerificationEmail } from '../utils/mail.functions';

// user signUp
async function signUp(userDetails: CreateUserDto) {
  try {
    const { email } = userDetails;

    // get email verification token
    const token = await getEmailVerificationToken({ ...userDetails });

    // Send email to client
    const send = await sendVerificationEmail(email, token);

    if (!send) {
      throw new Error(
        'Email not send.. some issue occurred, while sending mail',
      );
    }
    return send;
  } catch (err) {
    throw err;
  }
}

// activate Account
async function activateAccount(token: string) {
  try {
    // verify token
    const payload: any = await verifyToken(token);

    // destructure payload
    let {
      email,
      username,
      password,
      phone,
      dob,
      fullName,
      furigana,
      gender,
      businessId,
      employeeId,
      companyName,
      location,
      website,
      service,
      contractPeriod,
    }: CreateUserDto = payload;

    username = username.trim();
    fullName = fullName.trim();
    location = location.trim();
    businessId = +businessId;
    employeeId = +employeeId;
    phone = `${config.COUNTRY_CODE}${phone}`;

    // check user
    const exist = await prisma.user.findUnique({ where: { email } });

    // if present
    if (exist) {
      throw new Error(
        'User already exist or verified already. please sign up or login.',
      );
    }

    // Password hashed
    const hash = await bcrypt.hash(password, config.saltworkFactor);

    // create user
    const user = prisma.user.create({
      data: {
        email,
        username,
        phone,
        dob,
        fullName,
        furigana,
        businessId,
        employeeId,
        gender,
        password: hash,
      },
    });

    // create business
    const business = prisma.business.create({
      data: {
        email,
        businessId,
        companyName,
        location,
        website,
        service,
        contractPeriod,
      },
    });

    // user and business creation at once
    const create = prisma.$transaction([user, business]);

    // if user and business not created
    if (!create) {
      throw new Error('Some issue occurred while creating user and business');
    }

    return create;
  } catch (err) {
    throw err;
  }
}

// User logIn
async function logIn(loginDetails: ILogin, randomId: string) {
  try {
    const { otp_verified, otp, recognizedDevice, userEmail } = loginDetails;

    // response tuple
    let response: [boolean, string] = [false, ''];

    // get user object
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!recognizedDevice) {
      // send otp to client
      if (otp_verified === 'No') {
        await prisma.otp.deleteMany({ where: { email: user?.email } });

        // send otp to client phone
        const send = await sendOTP(user!.email, user!.phone, 'Login');

        // if otp not send
        if (!send) {
          throw new Error(
            'OTP Not send.. some issue occurred, while sending OTP',
          );
        }

        response[0] = send;
        return response;
      }

      // If otp_verified === 'Yes' then
      // validate otp
      if (!otp) throw new Error('Please provide otp first');

      // verify otp
      const verifyOTP = await verifyOtp(user!.email, otp.trim());

      // if not verified
      if (!verifyOTP?.verified) {
        throw new Error(verifyOTP?.msg);
      }

      // save deviceId to db
      const register = await prisma.user.update({
        where: {
          email: user!.email,
        },
        data: { devices: { push: randomId } },
      });

      // If not saved
      if (!register) {
        throw new Error('some issue occurred, while saving device to database');
      }
    }

    // If device got recognized
    // generate user token
    const token = await getToken(user!);

    // validate token
    if (!token) throw new Error('some issue occurred, while generating token');

    // save token to db
    const update = await prisma.user.update({
      where: {
        email: user!.email,
      },
      data: {
        tokens: {
          push: [{ id: randomId, token }],
        },
      },
    });

    // token not saved
    if (!update) {
      throw new Error('some issue occurred, while saving token to database');
    }

    response[1] = token;
    return response;
  } catch (err) {
    throw err;
  }
}

// User logOut
async function logOut(email: string, token: string) {
  // logout from all devices if token same (otherwise logged out single device)
  const loggedOut = await prisma.user.update({
    where: { email: email },
    data: {
      tokens: {
        deleteMany: { where: { token } },
      },
    },
  });

  // if not logged out
  if (!loggedOut) {
    throw new Error('some issue occurred, while logging out from all devices');
  }

  return loggedOut;
}

export default { logIn, signUp, logOut, activateAccount };
