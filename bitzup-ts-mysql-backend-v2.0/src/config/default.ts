import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: 4000,
  saltworkFactor: 10,
  jwtsecret: '12345-55555-09876-54321',
  jwtExp: '100d',
  EMAIL: 'claymindsolutions10@gmail.com',
  PASS: 'pdasogxhgxydkuvc',
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:4000'
      : 'http://192.46.213.147:4000',
};
