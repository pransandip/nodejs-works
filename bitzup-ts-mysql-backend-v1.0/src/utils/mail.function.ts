import nodeMailer from 'nodemailer';
import config from '../config/default';

const sendEmail = async (
  to: string,
  randomGenPass: string = '',
  otp: string,
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

  let mailOptions = {
    from: '"BitzUp" claymindsolutions10@gmail.com',
    to: to,
    subject: `${
      randomGenPass ? `Password Successfully Updated` : `Verify Your Email`
    }`,
    html: `${
      randomGenPass
        ? `<p>Password Successfully Updated</p>
           <p>This is your Email: ${to}</p>
           <p>This is your New Password : ${randomGenPass}</p>`
        : `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the process</p>
        <p>This code will <b>expire in 1 hour</b>.</p>`
    }`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

export default sendEmail;
