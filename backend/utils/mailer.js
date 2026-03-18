const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminderMail = async (toEmail, time) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Evening Reminder 🌙",
    text: `Hi 👋 This is your evening reminder set for ${time}. Stay consistent 💪`
  });
};

module.exports = sendReminderMail;