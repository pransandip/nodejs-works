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
