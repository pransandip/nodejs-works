const nodemailer = require('nodemailer');

const Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'shuklashobhit27121994@gmail.com', // generated ethereal user
        pass: 'acql kzbi syrt ckwp'
    },
    tls: {
        rejectUnauthorized: false,
    },

});
const semdMail = async (data) => {
    const mailOptions = {
        from: '"Aimee" <shuklashobhit27121994@gmail.com>', // sender  address
        to: data.email, // list of receivers
        subject: "Amiee: Email confirmation!!!", // Subject line
        text: '',
        html: `<!doctype html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>E-mailer</title>
            
        </head>
        
        <body style="font-family:Helvetica,Arial,sans-serif">
        <table align="center"  width="650" border="0" cellspacing="0" cellpadding="10"  style="border:1px solid #002C47;  background:#002C47; font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.4" >
          <tr>
            <td><table class="email-header" style="width: 100%; max-width: 620px; margin: 0 auto;">
                <tbody>
                  <tr>
                    <td align="center" valign="top" style="text-align:center; padding:0.2rem 0"><a href="#"><img class="email-logo" style=" width:150px;" src="https://www.aimgrp.co.uk/content/image/logos/AIM-group-logo-full.png" alt="logo"></a></td>
                  </tr>
                </tbody>
              </table>
              <table class="email-body" cellpadding="10" style="width: 96%; margin: 0 auto;background: #ffffff;">
                <tbody>
                  <tr>
                    <td style="padding:15px;"><h2 style="font-size: 18px; color:#002C47; font-weight: 600; margin: 0; line-height: 1.4;">Confirm Your E-Mail Address</h2></td>
                  </tr>
                  <tr>
                    <td style="padding:15px;"><p>Hi <b>${data.name},</b></p>
                        <p>Welcome!</p>
                        <p>You are receiving this email because you have registered on our site.</p>
                      <p>Click the link below to active your iweaver account.</p>
                      <p class="mb-4">This link will expire in 15 minutes and can only be used once.</p>
                      <p>&nbsp;</p>
                      <a href="https://iweaver.net/" style="background-color: #002C47; cursor:pointer; border-radius: 4px;color: #ffffff; display: inline-block;font-size: 13px; font-weight: 600; line-height: 44px; text-align: center;
            text-decoration: none;text-transform: capitalize ;padding: 0 30px; cursor:pointer;">Verify Email</a></td>
                  </tr>
                  <tr>
                    <td style="padding:15px;"><p>If you did not make this request, please contact us or ignore this message.</p>
                      <p class="email-note">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at <a href="#">help@aima.com</a></p></td>
                  </tr>
                </tbody>
              </table>
               <p>&nbsp;</p></td>
          </tr>
        </table>
        </body>
        </html>
        
        
        `
    }
    const info = await Transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('error occuring', err)
        } else {
            console.log("data=========",data)
        }
    });
    console.log("info------",info)

}

module.exports = semdMail;
