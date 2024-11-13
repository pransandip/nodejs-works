import path from 'path';
import config from '../config/default';
import nodeMailer from 'nodemailer';
import * as exphbs from 'express-handlebars';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import { IClientInfo } from '../types/models.types';

/*----- Send Email -----*/
const sendEmail = async (
  to: string,
  randomGenPass: string = '',
  otp: string,
  client_info: IClientInfo | undefined,
) => {
  // Create a Nodemailer transporter
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASS,
    },
  });

  // Create a Handlebars instance
  const hbs = exphbs.create({
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, '../views'),
    defaultLayout: false,
  });

  // Register 'hbs' as the rendering  engine
  transporter.use(
    'compile',
    nodemailerExpressHandlebars.default({
      viewEngine: hbs,
      viewPath: path.join(__dirname, '../views'),
    }),
  );

  let mailOptions = {
    from: '"BitzUp" claymindsolutions10@gmail.com',
    to: to,
    subject: randomGenPass
      ? 'Password Successfully Updated'
      : 'Verify Your Email',
    template: randomGenPass ? 'password' : 'otp',
    context: {
      email: to,
      password: randomGenPass,
      randomOTP: otp,
      base_url: config.BASE_URL,
      ip: client_info?.ip,
      city: client_info?.city,
      region: client_info?.region,
      country_name: client_info?.country_name,
      os_name: client_info?.os_name,
      client_name: client_info?.client_name,
      client_type: client_info?.client_type,
      device: client_info?.device_type,
    },
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

/*----- Send OTP Email -----*/
export const sendOTPEmail = async (
  to: string,
  subject: string,
  otp: string,
  client_info: IClientInfo | undefined,
) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASS,
    },
  });

  // Create a Handlebars instance
  const hbs = exphbs.create({
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, '../views'),
    defaultLayout: 'otp',
  });

  // Register 'hbs' as the rendering  engine
  transporter.use(
    'compile',
    nodemailerExpressHandlebars.default({
      viewEngine: hbs,
      viewPath: path.join(__dirname, '../views'),
    }),
  );

  let mailOptions = {
    from: '"BitzUp" claymindsolutions10@outlook.com',
    to: to,
    subject: subject,
    template: 'otp',
    context: {
      randomOTP: otp,
      base_url: config.BASE_URL,
      ip: client_info?.ip,
      city: client_info?.city,
      region: client_info?.region,
      country_name: client_info?.country_name,
      os_name: client_info?.os_name,
      client_name: client_info?.client_name,
      client_type: client_info?.client_type,
      device: client_info?.device_type,
    },
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

export default sendEmail;
