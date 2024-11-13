import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import path from 'path';
import {
  ILogin,
  ISession,
  IRegister,
  IUserPartial,
} from '../types/models.types';
import config from '../config/default';
import { COOKIE_EXP } from '../helpers/constants';
import userService from '../services/user.service';
import { sendPaymentEmail } from '../utils/mail.functions';

// user Registration
export async function signUp(req: Request, res: Response) {
  try {
    const userDetails: IRegister = req.body;

    // register user with signUp service
    await userService.signUp({ ...userDetails });

    // clear cookie from client for signup from same device
    res.clearCookie('sainta_deviceId');

    res.status(200).send({
      success: 1,
      message:
        'アカウントが正常に作成されました。メールを確認してアカウントを有効化してください。',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}

// activate Account
export async function activateAccount(req: Request, res: Response) {
  try {
    const { token } = req.params;

    // validate token
    if (!token) throw new Error('トークンが無効です。');

    // activate user account with activateAccount service
    const activated = await userService.activateAccount(token);

    if (!activated) {
      throw new Error('アカウントの有効化に失敗しました。もう一度お試しください。');
    }

    //send payment mail to client
    await sendPaymentEmail(activated[0]?.email);

    // redirect client to confirmation page
    res.redirect('/user/verified');
  } catch (err) {
    console.log((err as Error).message);
    let message = (err as Error).message;
    if (message === 'jwt expired') {
      message = 'トークンの有効期限が切れました。もう一度お試しください。';
    }
    res.redirect(`/user/verified/?error=true&message=${message}`);
  }
}

// verified page route
export async function getEmailVerifiedPage(req: Request, res: Response) {
  try {
    const { error, message } = req.query;
    console.log({ error, message });

    res.sendFile(path.join(__dirname, '../views/verified.html'));
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}

// User logIn
export async function logIn(req: Request, res: Response) {
  try {
    let loginDetails: ILogin = req.body;

    // gen a random Id
    const randomId = randomBytes(12).toString('hex');

    // login user with logIn service
    const [send, token] = await userService.logIn(loginDetails, randomId);

    if (send) {
      // send response
      res.status(200).json({
        success: 1,
        message: 'OTPが送信されました。メールを確認してください。',
      });
      return;
    }

    // send cookie & save session
    (req.session as ISession).loggedIn = true;
    (req.session as ISession).email = loginDetails.userEmail;
    (req.session as ISession).tokenId = randomId;
    (req.session as ISession).token = token;
    (req.session as ISession).sessionStart = new Date().toISOString();

    // cookie settings
    const options = {
      expires: COOKIE_EXP,
      httpOnly: true,
    };

    // send user a token
    res
      .status(201)
      .cookie('sainta_deviceId', req.body.clientDeviceId || randomId, options)
      .send({
        success: 1,
        message: 'ユーザーが正常にログインしました。',
        data: { email: loginDetails.userEmail, token },
      });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}

// User logOut
export async function logOut(req: Request, res: Response) {
  try {
    const { email }: IUserPartial = req.body.user;
    const token = (req.session as ISession).token;

    // remove session from db & destroy
    req.session.destroy(err => {
      if (err) throw new Error((err as Error).message);
    });

    // logout user with logOut service
    const loggedOut = await userService.logOut(email, token!);

    if (!loggedOut) {
      throw new Error(
        'ログアウトに失敗しました。もう一度お試しください。'
      );
    }

    // clear cookie from client
    res.clearCookie(config.SESSION_NAME);

    res.status(200).json({
      success: 1,
      message: 'ユーザーが正常にログアウトしました。',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}
