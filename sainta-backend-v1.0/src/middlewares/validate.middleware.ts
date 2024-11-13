import { Request, Response, NextFunction } from 'express';
import { IRegister } from '../types/models.types';
import { prisma } from '../prisma/prisma.client';

export async function isUserValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
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
      service,
      contractPeriod,
    }: IRegister = req.body;

    // validate parameters
    if (
      !email ||
      !username ||
      !password ||
      !phone ||
      !dob ||
      !fullName ||
      !furigana ||
      !gender ||
      !businessId ||
      !employeeId ||
      !companyName ||
      !location ||
      !service ||
      !contractPeriod
    ) {
      throw new Error('Please provide all field');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Please provide valid email address');
    }

    // validate username
    if (!/^[a-z]{5,}$/.test(username)) {
      throw new Error(
        'Please provide valid username, do not use spacial char or number, username must be min 5 char long',
      );
    }

    // validate Phone
    if (!/^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)) {
      throw new Error('Please provide valid phone number');
    }

    // check password
    if (password.length < 6) {
      throw new Error(
        'Password is too short! password must be min 6 char long',
      );
    }

    // check businessId
    if (businessId.toString().length < 6) {
      throw new Error(
        'Please provide valid businessId, businessId must be min 6 char long',
      );
    }

    // check employeeId
    if (employeeId.toString().length < 3) {
      throw new Error(
        'Please provide valid employeeId, employeeId must be min 3 char long',
      );
    }

    // check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error('User already exist');

    next();
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).json({ success: 0, message: (err as Error).message });
  }
}
