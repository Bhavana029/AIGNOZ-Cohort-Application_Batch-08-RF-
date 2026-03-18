const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendReminderMail = require("../utils/mailer");

const startReminderCron = () => {

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      const reminders = await Reminder.find({
        time: currentTime,
        isActive: true
      });

      for (let reminder of reminders) {

        console.log("Reminder userId:", reminder.userId);

        const user = await User.findById(reminder.userId);

        if (user && user.email) {
          console.log("User email found:", user.email);
          await sendReminderMail(user.email, reminder.time);
        }
      }

    } catch (error) {
      console.error("Cron error:", error);
    }

  }, {
    timezone: "Asia/Kolkata"   // ✅ ADD THIS
  });

  console.log("Reminder cron started ⏰");
};

module.exports = startReminderCron;