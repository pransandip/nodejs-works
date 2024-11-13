import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/prisma.client';
import { ISession, IUserPartial } from '../types/models.types';
import { verifyToken } from '../utils/utility.functions';

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = (req.session as ISession).token;
    if (!token) {
      throw new Error('You have to login first, You are not logged In');
    }

    const payload: any = await verifyToken(token);
    console.log({ payload });

    if (!payload) {
      throw new Error('You are not authorized, please login again');
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new Error(
        'You are not authorized or user not present, please login or sign up',
      );
    }

    const authUser = { ...user } as IUserPartial;
    delete authUser.password;
    delete authUser.tokens;
    delete authUser.devices;

    // add authUser to req object
    req.body.user = authUser;

    next();
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).json({ success: 0, message: (err as Error).message });
  }
}
