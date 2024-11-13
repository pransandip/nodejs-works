const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //     user: "lesley.ruecker28@ethereal.email",//testAccount.user,
    //     pass: "P6cnr8Xx5SgC1QXb6G",//testAccount.pass,
    // },

    service: "gmail",
    auth: {
      user: "nikhilkhedekar2012@gmail.com",//testAccount.user,
      pass: "ckeqxjdtnlvcpzza",//testAccount.pass,
    },

    // host: "premium241.web-hosting.com",
    // port: 465,
    // secure: true,
    // auth: {
    //     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    //     user: 'hello@bytestackai.com',
    //     pass: 'hello.?bytestackai.?2022'
    // }

    // host: "premium241.web-hosting.com",
    // port: 465,
    // secure: false, // use TLS
    // auth: {
    //     user: "hello@bytestackai.com",
    //     pass: "hello.?bytestackai.?2022",
    // },
    // tls: {
    //     // do not fail on invalid certs
    //     rejectUnauthorized: false,
    // },
});

module.exports = {
    transporter
}

// 1) Driver: SMTP
// 2) Host: premium241.web-hosting.com
// 3) Port: 465 for SSL, 587 for TLS
// 4) username. - hello@bytestackai.com
// 5) Encryption : SSL or TLS
// 6) password : hello.?bytestackai.?2022

// var listOfRecipients = ["Reciever1 <reciever1@domain.com>", "Reciever2 <reciever2@domain.com>"]
// for (var i = 0; i < listOfRecipients.length; i++) { 
//     var mailOptions = {
//         from: 'Sender <sender@sender.com>', // sender address
//         to: listOfRecipients[i], // list of receivers
//         subject: 'Hello', // Subject line
//         text: 'Hello world', // plaintext body
//         html: '<b>Hello world</b>' // html body
//     };
//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             res.send(error);
//         } else {
//             res.send('Message sent: ' + res);
//         }
//     });
// }