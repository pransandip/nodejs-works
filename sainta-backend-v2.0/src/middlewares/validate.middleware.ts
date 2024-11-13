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
      throw new Error('全てのフィールドを入力してください。');
    }

    // validate Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('メールアドレスが正しくありません。');
    }

    // validate username
    if (!/^[a-z]{5,}$/.test(username)) {
      throw new Error(
        'ユーザ名が正しくありません。ユーザ名は5文字以上である必要があります。',
      );
    }

    // validate Phone
    if (!/^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)) {
      throw new Error('電話番号が正しくありません。');
    }

    // check password
    if (password.length < 6) {
      throw new Error(
        'パスワードは6文字以上である必要があります。',
      );
    }

    // check businessId
    if (businessId.toString().length < 6) {
      throw new Error(
        'サインタIDが正しくありません。サインタIDは6文字以上である必要があります。',
      );
    }

    // check employeeId
    if (employeeId.toString().length < 3) {
      throw new Error(
        '従業員IDが正しくありません。従業員IDは3文字以上である必要があります。',
      );
    }

    // check user
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error('このメールアドレスは既に登録されています。');

    next();
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).json({ success: 0, message: (err as Error).message });
  }
}
