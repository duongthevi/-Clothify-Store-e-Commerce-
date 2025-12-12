const nodemailer = require("nodemailer");

// hàm sinh mã xác thực
function generateCode(length = 6) {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
}

// hàm gửi email
async function sendMail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

module.exports = { sendMail, generateCode };
