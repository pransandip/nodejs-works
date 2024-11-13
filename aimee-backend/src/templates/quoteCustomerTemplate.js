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
const sendQuoteMailToCust = async (data) => {
  console.log("datadatadatadata",data);
    const mailOptions = {
        from: '"Aimee" <shuklashobhit27121994@gmail.com>',
        to: data.email,
        subject: "Amiee: Quote Details!!!",
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
                    <td style="padding:15px;">
                        <p>Welcome <b> ${data.firstName} </b>!</p>
                        <p>Following are the details of submitted Quote :</p>
                        <p>ProjectRef : <b>  ${data.ProjectRef} </b></p>
                        <p>QuoteValidFrom : <b> ${data.QuoteValidFrom} days</b></p>
                        <p>PaymentWithin : <b> ${data.PaymentWithin} days </b></p>
                        <p>BillingType : <b>  ${data.BillingType} </b></p>
                        <p>ServiceType : <b>  ${data.ServiceType} </b></p>
                        <p>Steel : <b> ${data.Steel} </b></p>
                        <p>Finish : <b> ${data.Finish} </b></p>
                        <p>FabDrawing : <b> ${data.FabDrawing} </b></p>
                        <p>Bolts : <b> ${data.Bolts} </b></p>
                        <p>AnchorBolts : <b> ${data.AnchorBolts} </b></p>
                        <p>Programme : <b> ${data.Programme} </b> </p>
                        <p>Comments : <b> ${data.Comments} </b></p>
                      <p>&nbsp;</p>
                      <a href="http://localhost:3000/hexadash-react/acceptquote/`+data.quoteid+`" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; background-color : blue ;color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Accept</a>
                      <a href="http://localhost:3000/hexadash-react/rejectquote/`+data.quoteid+`" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; background-color : red ; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Reject</a>                    </td>
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
         //   console.log("data=========",data)
        }
    });
    // console.log("info------",info)

}

module.exports = sendQuoteMailToCust;
