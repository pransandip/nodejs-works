import * as dotenv from 'dotenv';
dotenv.config();

// APP Running PORT
const PORT = process.env.PORT || 4000;

// API URL
const BASE_URL =
  process.env.APP_ENV === 'DEV'
    ? `http://localhost:${PORT}`
    : `${process.env.BACKEND_URL}:${PORT}`;

// Frontend URL
const FRONTEND_URL =
  process.env.APP_ENV === 'DEV'
    ? 'http://localhost:3000'
    : `${process.env.FRONTEND_URL}`;

// Session Configuration
const SESSION_NAME = 'sainta_sid';
const SESSION_SECRET = '510f9a35571ef31615246926b7489e7c';
const IN_PROD = process.env.APP_ENV === 'DEV' ? false : false;

// JWT Configuration
const JWT_EXP = '7d';
const JWT_EXP_EMAIL = '10m';
const JWT_SECRET =
  'a1e288490e7cf9591d44863abd730f65be39129b5be4b4ef9d781d4087fcc9a8';

// Email Credentials
const EMAIL = process.env.APP_EMAIL;
const EMAIL_PASS = process.env.APP_EMAIL_PASS;

// Twilio Credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NO = process.env.TWILIO_PHONE_NO;
const COUNTRY_CODE = process.env.COUNTRY_CODE;

// MONGO_DB Credentials
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const MONGO_URL =
  process.env.DATABASE_URL ||
  `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.1mzibpo.mongodb.net/saintaAuthDB?retryWrites=true&w=majority`;

export default {
  PORT,
  BASE_URL,
  FRONTEND_URL,
  IN_PROD,
  SESSION_NAME,
  SESSION_SECRET,
  JWT_EXP,
  JWT_EXP_EMAIL,
  JWT_SECRET,
  EMAIL,
  EMAIL_PASS,
  MONGO_URL,
  COUNTRY_CODE,
  TWILIO_PHONE_NO,
  TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID,
  saltworkFactor: 10,
};
