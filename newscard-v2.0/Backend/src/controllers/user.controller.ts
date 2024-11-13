import { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import config from '../config/default';
import { prisma } from '../prisma/prisma.client';
import { ISession, IUser, IUserPartial } from '../types/models.types';
import {
  checkPassword,
  getEmailVerificationToken,
  getToken,
  sendPhoneOTP,
  verifyOtp,
  verifyToken,
} from '../utils/utility.function';
import { sendVerificationEmail } from '../utils/mail.function';
import { COOKIE_EXP } from '../helpers/constants';
import userService from '../services/user.service';

/*----- validate user for SignUp -----*/
export const validateSignUpUser = async (req: Request, res: Response) => {
  try {
    const { email, username, phone, password, otp_verified, otp }: IUser =
      req.body;

    // validate parameters
    if (!email || !username || !phone || !password || !otp_verified) {
      throw new Error('Please provide all field');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // validate username
    if (!!/^[a-zA-Z ]*$/.test(username)) {
      throw new Error(
        'Please provide valid username, use spacial char or number',
      );
    }

    // validate Phone
    if (typeof parseInt(phone) !== 'string' && phone.trim().length <= 10) {
      throw new Error('Please provide valid phone number');
    }

    // check password
    if (password.length < 6) {
      throw new Error(
        'Password is too short! password must be min 6 char long',
      );
    }

    // check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error('User already exist');

    // send otp to client
    if (otp_verified === 'No') {
      await prisma.otp.deleteMany({ where: { email } });

      // send SMS
      const send = await sendPhoneOTP(email, phone);

      // OTP not send
      if (!send) {
        throw new Error(
          'OTP Not send.. some issue occurred, while sending OTP',
        );
      }

      // clear cookie from client for signup from same device
      res.clearCookie('newscard_deviceId');

      res.status(200).send({
        success: '1',
        message: 'OTP send to your mobile plz check',
      });
      return;
    }

    // validate otp
    if (!otp) throw new Error('Please provide otp first');

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      throw new Error(verifyOTP?.msg);
    }

    // delete existing token
    await prisma.signUpToken.deleteMany({ where: { email } });

    // get email verification token
    const token = await getEmailVerificationToken({
      email,
      username,
      phone,
      password,
    });

    // storing signUp token to db
    const store = await prisma.signUpToken.create({
      data: {
        email,
        token,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 600000}`,
      },
    });

    if (!store)
      throw new Error(
        'signUp token not saved to db.. some issue occurred, while storing',
      );

    res.status(201).send({
      success: '1',
      message: 'User mobile is verified',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- SignUp -----*/
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, link, bio, city, firstname, lastname, userType }: IUser =
      req.body;
    const image = req.file?.filename;
    console.log({ userType });
    console.log(req.file?.filename);

    // validate parameters
    if (!email || !image || !city || !firstname || !lastname || !userType) {
      throw new Error('Please provide all field');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error('User already exist');

    // Check signUp Token Record
    const signUpTokenRecord = await prisma.signUpToken.findFirst({
      where: { email },
    });

    // opt record not present
    if (!signUpTokenRecord) {
      throw new Error(
        `signUp token record doesn't exist or has been verified already. please sign up or log in.`,
      );
    }

    // verify token
    const payload: any = await verifyToken(signUpTokenRecord.token);
    console.log({ payload });

    // if no payload
    if (!payload)
      throw new Error(
        'signUp has expired. Please please sign up or log in again.',
      );

    // destructure payload
    const { username, phone, password }: IUser = payload;

    // get email verification token
    const token = await getEmailVerificationToken({
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
      image: `${config.BASE_URL}/upload/${image}`,
    });

    // Send email to client
    const send = await sendVerificationEmail(email, token);

    if (!send)
      throw new Error(
        'Email not send.. some issue occurred, while sending mail',
      );

    // delete existing token
    await prisma.signUpToken.deleteMany({ where: { email } });

    res.status(201).send({
      success: '1',
      message:
        'Email send successfully.. Need to be verified first for signup, please check your email.',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Activate account -----*/
export const activateAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // validate token
    if (!token) throw new Error('something went wrong!');

    // verify token
    const payload: any = await verifyToken(token);
    console.log({ payload });

    // if no payload
    if (!payload) throw new Error('Incorrect or Expired link');

    // destructure payload
    const {
      email,
      phone,
      username,
      bio,
      link,
      city,
      image,
      password,
      userType,
      firstname,
      lastname,
    }: IUser = payload;

    const cardPATH = `${firstname}${lastname}`.toLowerCase();
    const handle = `${config.BASE_URL}/cards/${cardPATH}`;

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
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        username,
        bio,
        link,
        image,
        city,
        firstname,
        lastname,
        userType,
        password: hash,
      },
    });

    // Error while creating account
    if (!user) throw new Error('Some issue occurred, while creating account!');

    // create personal card on db
    const card = await prisma.card.create({
      data: {
        email,
        title: `${firstname} ${lastname}`,
        handle,
        typeOfCard: 'Person',
        cardRegAs: 'Personal',
        image,
        tagLine: bio,
        User: { connect: { id: user.id } },
      },
    });

    // if card not saved
    if (!card)
      throw new Error('Some issue occurred while creating personal card');

    res.redirect('/user/verified');
  } catch (err) {
    console.log((err as Error).message);
    let message = (err as Error).message;
    if (message === 'jwt expired') {
      message = 'Incorrect or Expired link.';
    }
    res.redirect(`/user/verified/?error=true&message=${message}`);
  }
};

/*----- verified page route -----*/
export const getEmailVerifiedPage = async (req: Request, res: Response) => {
  try {
    const { error, message } = req.query;
    console.log({ error, message });

    res.sendFile(path.join(__dirname, '../views/verified.html'));
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*------  LogIn  ------*/
export const logIn = async (req: Request, res: Response) => {
  try {
    let { username, password, otp_verified, otp }: IUser = req.body;
    username = username.trim();
    password = password.trim();
    // otp_verified = otp_verified!.trim();
    console.log({ username });

    // gen a random Id
    const randomId = randomBytes(12).toString('hex');

    if (!username || !password || !otp_verified) {
      throw new Error('Please provide all field');
    }

    // check user
    let user: IUser | null;

    if (!!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
      // if email
      user = await prisma.user.findUnique({
        where: { email: username },
      });
    } else if (!/^[a-zA-Z ]*$/.test(username)) {
      // if username
      user = await prisma.user.findUnique({
        where: { username },
      });
    } else {
      throw new Error('Please provide valid username or email address');
    }

    // check password
    if (password.length < 6) {
      throw new Error('Password is too short!');
    }

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // check password
    const same = await checkPassword(password, user.password);

    if (!same) {
      throw new Error('Please provide correct password');
    }

    if (!req.body.recognizedDevice) {
      // send otp to client
      if (otp_verified === 'No') {
        await prisma.otp.deleteMany({ where: { email: user.email } });

        // send SMS
        const send = await sendPhoneOTP(user.email, user.phone, 'Login');

        // OTP not send
        if (!send) {
          throw new Error(
            'OTP Not send.. some issue occurred, while sending OTP',
          );
        }

        res.status(200).send({
          success: '1',
          message: 'OTP send to your mobile plz check',
        });
        return;
      }

      // validate otp
      if (!otp) throw new Error('Please provide otp first');

      // verify otp
      const verifyOTP = await verifyOtp(user.email, otp.trim());

      // if not verified
      if (!verifyOTP?.verified) {
        throw new Error(verifyOTP?.msg);
      }

      // save deviceId to db
      const register = await prisma.user.update({
        where: {
          email: user.email,
        },
        data: { devices: { push: randomId } },
      });

      // If not saved
      if (!register) {
        throw new Error('some issue occurred, while saving device to database');
      }
    }

    // generate user token
    const token = await getToken(user);

    // save token to db
    const update = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        tokens: {
          push: [{ id: randomId, token }],
        },
      },
    });

    // token not saved
    if (!update)
      throw new Error('some issue occurred, while saving token to database');

    // send cookie & save session
    (req.session as ISession).loggedIn = true;
    (req.session as ISession).email = user.email;
    (req.session as ISession).tokenId = randomId;
    (req.session as ISession).token = token;
    (req.session as ISession).sessionStart = new Date().toISOString();

    // cookie settings
    const options = {
      expires: COOKIE_EXP,
      httpOnly: true,
    };

    // delete password from user object
    const loggedInUser = { ...user } as IUserPartial;
    delete loggedInUser.password;

    // send user a token
    res
      .status(201)
      .cookie('newscard_deviceId', req.body.clientDeviceId || randomId, options)
      .send({
        success: '1',
        message: 'User loggedIn Successfully',
        data: { email: loggedInUser.email, token },
      });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- LogOut -----*/
export const LogOut = async (req: Request, res: Response) => {
  try {
    const { email: email }: { email: string } = req.body.user;
    const token = (req.session as ISession).token;

    // remove session from db & destroy
    req.session.destroy(err => {
      if (err) throw new Error((err as Error).message);
    });

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
    if (!loggedOut)
      throw new Error(
        'some issue occurred, while logging out from all devices',
      );

    // clear cookie from client
    res.clearCookie('newscard_sid');

    res.status(201).json({
      success: '1',
      message: 'User loggedOut Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Reset password -----*/
export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email, password, otp }: IUser = req.body;

    if (!email || !password || !otp) {
      throw new Error('Please provide all field');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // check password
    if (password.length < 6) {
      throw new Error(
        'Please provide a valid password, password is too short!',
      );
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) throw new Error('User not found');

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      throw new Error(verifyOTP?.msg);
    }

    // Password hashed
    const hash = await bcrypt.hash(password, config.saltworkFactor);

    // Update user password
    const result = await prisma.user.update({
      where: { email: user.email },
      data: { password: hash },
    });

    // if pass not saved
    if (!result) {
      throw new Error(
        'password not changed, issue occurred while changing password',
      );
    }

    res.status(201).json({
      success: '1',
      message: 'Password Successfully Updated',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { userEmail }: { userEmail: string } = req.body;
    const { email }: { email: string } = req.body.user;

    const user = await userService.followUser(userEmail, email);

    return res.status(201).json({
      success: '1',
      message: 'User followed Successfully',
      data: { ...user, tokens: null },
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unFollowUser = async (req: Request, res: Response) => {
  try {
    const { userEmail }: { userEmail: string } = req.body;
    const { email }: { email: string } = req.body.user;

    const user = await userService.unFollowUser(userEmail, email);

    return res.status(201).json({
      success: '1',
      message: 'User UnFollowed Successfully',
      data: { ...user, tokens: null },
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const image = req.file?.filename;
    const { email }: { email: string } = req.body.user;
    let { phone, newEmail, currentPassword, newPassword, userType } = req.body;

    // update user with user service
    const user = await userService.updateUser({
      email,
      image,
      phone,
      newEmail,
      currentPassword,
      newPassword,
      userType,
    });

    return res.status(201).json({
      success: '1',
      message: 'User successfully updated',
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        username: user.username,
      },
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchUsers = async (_req: Request, res: Response) => {
  try {
    const user = await userService.fetchUsers();

    return res.status(201).json({
      success: '1',
      message: 'Successfully Fetched All the users',
      data: user,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body.user;
    if (!email) throw new Error('please provide email first');

    const user = await userService.fetchUserByEmail(email);

    return res.status(201).json({
      success: '1',
      message: 'User Fetched Successfully',
      data: user,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};


export const fetchConnectedUserByEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email }: { email: string } = req.body.user;
    if (!email) throw new Error('please provide email first');
 
    const followers = await userService.fetchFollowers(email);
    const followings = await userService.fetchFollowings(email);
 
    const emails = [
      ...followers.flatMap(e => e.followers),
      ...followings.flatMap(e => e.following),
    ];
 
    const results = await userService.fetchConnectedUsersByEmail(emails);
 
    return res.status(201).json({
      success: '1',
      message: 'User Fetched Successfully',
      data: results,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    const user = await userService.deleteUser(id, email);

    return res.status(201).json({
      success: '1',
      message: 'User Successfully deleted',
      data: user,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const assignUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!userId) throw new Error('please provide id first');
    if (userId.length !== 24) throw new Error('please provide a valid Id');

    await userService.assignUserRole(userId, email, role);

    return res.status(201).json({
      success: '1',
      message: 'User Role Successfully updated',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
