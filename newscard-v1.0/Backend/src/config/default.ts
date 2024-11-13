import * as dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 4000;

export default {
  PORT: PORT,
  saltworkFactor: 10,
  JWT_SECRET:
    '4f1feeca525de4cdb064656007da3edac7895a87ff0ea865693300fb8b6e8f9c',
  JWT_EXP: '7d',
  JWT_EXP_EMAIL: '10m',
  SESSION_NAME: 'newscard_sid',
  SESSION_SECRET:
    process.env.SESSION_SECRET || 'cde374929f9b33a3ff96e9ef3daee33a',
  IN_PROD: process.env.APP_ENV === 'development' ? false : false,
  EMAIL: process.env.APP_EMAIL || 'claymindsolutions10@gmail.com',
  PASS: process.env.APP_EMAIL_PASS || 'pdasogxhgxydkuvc',
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? `http://localhost:${PORT}`
      : `http://api.testernewscard.com:${PORT}`,
  FRONTEND_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:3000'
      : 'http://testernewscard.com',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NO: process.env.TWILIO_PHONE_NO,
  MONGO_URL:
    process.env.DATABASE_URL ||
    'mongodb+srv://sandiproyvirtualemployee:hJ06iYBqDzN8M6c5@cluster0.1mzibpo.mongodb.net/newscardAuthDB?retryWrites=true&w=majority',
};
