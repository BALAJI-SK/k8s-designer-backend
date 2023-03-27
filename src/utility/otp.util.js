const nodemailer = require('nodemailer');
const crypto = require('crypto');
const httpError = require('../exceptions/user.exception');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
});

const sendOtp = async (email) => {
  const OTP = crypto.randomInt(100000, 999999).toString();
  const imagePath = path.resolve(__dirname, 'abcd.gif');

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'OTP for registration (K8S Designer)',
    html: `<h1>Hello Developer!</h1><h3>Your OTP is <b>${OTP}</b></h3><p>This OTP is valid for 5 minutes</p><img src="cid:image1" alt="image"><p>Regards,</p><p>K8S Designer Team</p>`,
    attachments: [
      {
        filename: 'abcd.gif',
        path: imagePath,
        cid: 'image1',
      },
    ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(new httpError('some problem with the email', 400));
      } else {
        console.log('Email sent: ' + info.response);
        resolve(OTP);
      }
    });
  });
};

module.exports = { transporter, sendOtp };
