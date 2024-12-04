const nodemailer = require('nodemailer');

// credentials for sending email 
const mailSender = "support@monegliseci.com";
const mailSenderPasswrod = "Welcome123.!@#";

const transport = nodemailer.createTransport({
  host: "smtp.office365.com",
  secureConnection: true,
  port: 587,
  auth: {
    user: mailSender,
    pass: mailSenderPasswrod
  }
});


async function sendEmail(toEmail, subject, text, html) {
  try {
    const info = await transport.sendMail({
      from: mailSender,
      to: toEmail,
      subject: subject, // Subject line
      text: text, // plain text body
      html: html
    });
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.log('sending email error: ', 'Failed');
  }
}

module.exports = { sendEmail };

