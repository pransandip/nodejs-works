import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/prisma.client';
import { IUser } from '../types/models.types';

export const isDeviceRecognized = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deviceId = req.cookies.newscard_deviceId;
    let { username }: IUser = req.body;
    username = username.trim();
    console.log({ deviceId });

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

    // Device is not recognized, 2FA is required
    if (!deviceId) {
      req.body.recognizedDevice = false;
    } else {
      // check register devices
      const registered = await prisma.user.findFirst({
        where: {
          email: user?.email,
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
    res.status(400).json({ success: '0', message: (err as Error).message });
  }
};
