import path from 'path';
import config from '../config/default';
import nodeMailer from 'nodemailer';
import * as exphbs from 'express-handlebars';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

/*-------------------- Email handler ------------------*/
// create a Nodemailer transporter
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASS,
  },
});

// create a Handlebars instance
const hbs = exphbs.create({
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, '../views'),
  defaultLayout: false,
});

// register 'hbs' as the rendering  engine
transporter.use(
  'compile',
  nodemailerExpressHandlebars.default({
    viewEngine: hbs,
    viewPath: path.join(__dirname, '../views'),
  }),
);

// send client a verification mail for signup
export async function sendVerificationEmail(to: string, token: string) {
  const mailOptions = {
    from: '"Sainta" claymindsolutions10@gmail.com',
    to: to,
    subject: 'Verify your Email',
    template: 'activate',
    context: {
      token,
      base_url: config.BASE_URL,
    },
  };

  const response = await transporter
    .sendMail(mailOptions)
    .then(info => {
      console.log(info);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });

  return response;
}

// send client payment mail
export async function sendPaymentEmail(to: string) {
  const mailOptions = {
    from: '"Sainta" claymindsolutions10@gmail.com',
    to: to,
    subject: 'Make Payment',
    template: 'payment',
    context: {
      base_url: config.BASE_URL,
      frontend_url: config.FRONTEND_URL,
    },
  };

  const response = await transporter
    .sendMail(mailOptions)
    .then(info => {
      console.log(info);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });

  return response;
}
