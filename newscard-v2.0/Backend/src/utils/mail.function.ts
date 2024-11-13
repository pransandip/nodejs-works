import nodeMailer from 'nodemailer';
import config from '../config/default';

/*----- Email handler -----*/
export const sendVerificationEmail = async (to: string, token: string) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASS,
    },
  });

  const mailOptions = {
    from: '"NewsCard" claymindsolutions10@gmail.com',
    to: to,
    subject: 'Verify your Email',
    html: `<p> verify your email address to complete the signup process</p>
    <p>This link will <b>expire in 10 minutes</b>.</p>
    <p>Press <a href=${config.BASE_URL}/user/authentication/activate/${token}> here</a> to proceed.</p>`,
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
};
