import { Session } from 'express-session';

export interface ISession extends Session {
  loggedIn?: boolean;
  tokenId?: string;
  token?: string;
  email?: string;
  sessionStart?: string;
}

export interface IUser {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  image?: string | null;
  bio?: string | null;
  link?: string | null;
  city?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  otp?: string;
  otp_verified?: string;
  isVerified?: string;
  userType?: 'Regular' | 'Mode' | 'Admin' | 'SuperAdmin';
  createdAt?: Date;
  updatedAt?: Date;
  tokens?: Token[];
}

export interface IUserPartial {
  id?: string;
  email: string;
  username: string;
  password?: string;
  phone: string;
  image?: string | null;
  bio?: string | null;
  link?: string | null;
  city?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  otp?: string;
  otp_verified?: string;
  userType?: 'Regular' | 'Mode' | 'Admin' | 'SuperAdmin';
  isVerified?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tokens?: Token[];
}

export interface Token {
  id?: string | null;
  token?: string | null;
}

export interface ICard {
  id?: string;
  email?: string;
  title: string;
  handle: string;
  association: string;
  cardAccess: 'Public' | 'Private' | 'FollowersOnly' | 'FollowingOnly';
  typeOfCard: 'Actor' | 'Person' | 'Event';
  cardRegAs: 'Regular' | 'Personal';
  image?: string;
  tagLine?: string;
}

export interface ICardQuery {
  filter?: 'ALL';
  limit?: number;
  page?: number;
  sort?: 'asc' | 'desc';
  id?: string;
}

export interface IPCardQuery {
  filter?: 'owned' | 'following' | 'trending';
}

export interface IPost {
  id?: string;
  email: string;
  body?: string;
  image?: string;
  link?: string;
  likes?: number;
  disLikes?: number;
}

export interface IChatSocketUserMapData {
  userId: string;
  socketId: string;
}

export interface IChatMessagesData {
  senderId: string;
  receiverId: string;
  message: string;
  docUrl: string;
  messageType: 'TEXT' | 'IMAGE';
}

export interface IChatMessagesNotificationData {
  email: string;
  userId: string;
  notificationCount: number;
}

