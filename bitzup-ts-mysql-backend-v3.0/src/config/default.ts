import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: 4000,
  saltworkFactor: 10,
  jwtsecret: '12345-55555-09876-54321',
  jwtExp: '100d',
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:4000'
      : 'http://192.46.213.147:4000',
  zoho_token:
    'Zoho-enczapikey PHtE6r1fEOzr3zQt8UMF5fK5R5byNY0sqbtmLVQSsIxBDfRRG01W/9gvmzO/okh7APFGEvKYzIo+ub+csezUczm/PGtOVGqyqK3sx/VYSPOZsbq6x00asV8TckbdVIHpdd9r1SHXs9veNA==',
  zepto_url: 'https://api.zeptomail.in/v1.1/email',
};
