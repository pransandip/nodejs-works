import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/utility.function';
import { prisma } from '../prisma/prisma.client';
import { IUserPartial } from '../types/models.types';

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    console.log({ authorization });

    if (!authorization) {
      throw new Error('You are not authorized');
    } else if (!authorization.startsWith('Bearer ')) {
      throw new Error('You are not authorized');
    }

    const payload: any = await verifyToken(authorization.split(' ')[1]);
    console.log({ payload });

    if (!payload) {
      throw new Error('You are not authorized');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    const authUser = { ...user } as IUserPartial;
    delete authUser.password;
    req.body.user = authUser;

    next();
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).json({ success: '0', message: (err as Error).message });
  }
};
