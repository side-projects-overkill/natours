const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
  });
  // Define the email option
  const mailOptions = {
    from: 'Deepesh Nair <deepesh@hybridx.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // Actually send the email
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
