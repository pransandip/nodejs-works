import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/prisma.client';
import { ILogin, IUser } from '../types/models.types';
import { checkPassword } from '../utils/utility.functions';

export async function isDeviceRecognized(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const deviceId = req.cookies.sainta_deviceId;
    console.log({ deviceId });

    let { username, password, businessId, otp_verified }: ILogin = req.body;
    username = username.trim();
    password = password.trim();

    if (!username || !password || !businessId || !otp_verified) {
      throw new Error('全てのフィールドを入力してください。');
    }

    // check user
    let user: IUser | null;

    if (!!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
      // If email
      user = await prisma.user.findUnique({
        where: { email: username },
      });
    } else if (!!/^[a-z]{5,}$/.test(username)) {
      // If username
      user = await prisma.user.findUnique({
        where: { username },
      });
    } else {
      throw new Error('ユーザ名またはメールアドレスが正しくありません。');
    }

    // check password
    if (password.length < 6) {
      throw new Error('パスワードは6文字以上である必要があります。');
    }

    // user not present
    if (!user) {
      throw new Error('ユーザーが見つかりません。');
    }

    // If present add user email to request object
    req.body.userEmail = user.email;

    // check password
    const same = await checkPassword(password, user.password);

    if (!same) {
      throw new Error('パスワードが正しくありません。');
    }

    // Device is not recognized, 2FA is required
    if (!deviceId) {
      req.body.recognizedDevice = false;
    } else {
      // check register devices
      const registered = await prisma.user.findFirst({
        where: {
          email: user.email,
          devices: { has: deviceId },
        },
      });

      console.log({ registered });

      if (!registered) {
        req.body.recognizedDevice = false;
        req.body.clientDeviceId = false;
      } else {
        // If Device is recognized, no need for 2FA
        req.body.recognizedDevice = true;
        req.body.clientDeviceId = deviceId;
      }
    }

    next();
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).json({ success: 0, message: (err as Error).message });
  }
}
