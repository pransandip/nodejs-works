import { Session } from 'express-session';

export interface IRegister {
  email: string;
  username: string;
  password: string;
  phone: string;
  dob: Date;
  fullName: string;
  furigana: string;
  gender: 'Male' | 'Female';
  businessId: number;
  employeeId: number;
  companyName: string;
  location: string;
  website?: string | null;
  service: 'Gyoumu' | 'BoshuuRecruiter' | 'BoshuuJobseeker' | 'Rabo';
  contractPeriod: 'Monthly' | 'Yearly';
}

export interface ILogin {
  username: string;
  password: string;
  businessId: number;
  otp?: string;
  otp_verified: 'Yes' | 'No';
  userEmail: string;
  recognizedDevice: boolean;
  clientDeviceId?: boolean | string;
}

export interface ISession extends Session {
  loggedIn?: boolean;
  tokenId?: string;
  token?: string;
  email?: string;
  sessionStart?: string;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  dob: Date;
  fullName: string;
  furigana: string;
  gender: 'Male' | 'Female';
  businessId: number;
  employeeId: number;
  permissions: 'Admin' | 'Regular';
  isVerified: Boolean;
  isLoggedIn: Boolean;
  createdAt: Date;
  updatedAt: Date;
  devices?: string[];
  tokens?: Token[];
}

export interface IUserPartial {
  id?: string;
  email: string;
  username: string;
  password?: string;
  phone: string;
  dob: Date;
  fullName: string;
  furigana: string;
  gender: 'Male' | 'Female';
  businessId: number;
  employeeId: number;
  permissions: 'Admin' | 'Regular';
  isVerified?: Boolean;
  isLoggedIn?: Boolean;
  createdAt: Date;
  updatedAt: Date;
  devices?: string[];
  tokens?: Token[];
}

export interface Token {
  id?: string | null;
  token?: string | null;
}

export interface ICustomer {
  id: string;
  email: string;
  businessId: number;
  name: string;
  phone: string;
  address: string;
  company: string;
  dateMet: Date;
  dayBirth: Date;
  furigana: string;
  hearAbout: '紹介' | '訪問' | 'ネット' | 'その他';
  customerId: number;
  lastContact: Date;
  nextContact: Date;
  notes?: string;
  methodMet: '紹介' | '訪問' | 'ネット' | 'その他';
  position: string;
  languagePreference:
    | '日本語'
    | '英語'
    | '中国語'
    | '韓国語'
    | 'スペイン語'
    | 'フランス語'
    | 'ドイツ語'
    | 'その他';
  supportDetails?: string;
  supportRequired: 'なし' | 'あり';
  supportSatisfaction: number;
  preferredContactMethod: '電話' | 'メール' | '訪問' | 'その他';
}
