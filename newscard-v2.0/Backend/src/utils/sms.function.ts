import { Twilio } from 'twilio';
import config from '../config/default';

/*----- SMS handler -----*/
export const sendSMS = async (otp: string, phone: string, sub: string) => {
  const client = new Twilio(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN,
  );

  const response = client.messages
    .create({
      body: `OTP for ${sub} is: ${otp} (valid for 5 mins). Do not share with anyone. -NewsCard`,
      from: config.TWILIO_PHONE_NO,
      to: phone,
    })
    .then(message => {
      console.log(message);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });

  return response;
};
