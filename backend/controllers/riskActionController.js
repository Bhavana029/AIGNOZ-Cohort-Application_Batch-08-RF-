const Checkin = require("../models/Checkin");
const Insight = require("../models/Insight");
const cron = require("node-cron");
const sendReminderMail = require("../utils/mailer");
const User = require("../models/User");

const Reminder = require("../models/Reminder");
/*
---------------------------------------------------
GET TODAY'S PLAN
---------------------------------------------------
*/

exports.getTodayPlan = async (req, res) => {
  try {
    const latestInsight = await Insight.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!latestInsight) {
      return res.status(404).json({
        message: "No insights found"
      });
    }

    const risk = latestInsight.riskExplanation.risk;

    let plan = [];

    if (risk === "High Risk") {
      plan = [
        "Avoid triggers today",
        "Schedule a 15-min mindfulness session",
        "Early dinner before 7 PM",
        "Sleep before 10:30 PM"
      ];
    } else if (risk === "Medium Risk") {
      plan = [
        "Light 20-min walk",
        "Hydrate properly",
        "Reduce screen time at night"
      ];
    } else {
      plan = [
        "Maintain current routine",
        "Morning stretching",
        "Balanced meals"
      ];
    }

    res.status(200).json({ plan });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate plan" });
  }
};


/*
---------------------------------------------------
START MORNING WALK
---------------------------------------------------
*/

exports.startMorningWalk = async (req, res) => {
  try {

    await Checkin.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { activity: 20 } }, // simulate 20 min walk
      { sort: { createdAt: -1 } }
    );

    res.status(200).json({
      message: "Great job! 20 minutes added to today's activity."
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to start walk"
    });
  }
};


/*
---------------------------------------------------
SET EVENING REMINDER
---------------------------------------------------
*/






exports.setEveningReminder = async (req, res) => {
  try {

    const { time } = req.body;

    if (!time) {
      return res.status(400).json({
        message: "Reminder time required"
      });
    }

    await Reminder.findOneAndUpdate(
      { userId: req.user.id },
      { time, isActive: true },
      { upsert: true }
    );

    res.status(200).json({
      message: `Reminder saved for ${time} 💾`
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to set reminder"
    });
  }
};


/*
---------------------------------------------------
VIEW STREAK
---------------------------------------------------
*/

exports.getStreak = async (req, res) => {
  try {

    const checkins = await Checkin.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!checkins.length) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0
      });
    }

    // Normalize date (remove time)
    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    let currentStreak = 1;
    let longestStreak = 1;

    // 🔥 CURRENT STREAK
    for (let i = 1; i < checkins.length; i++) {

      const prev = normalizeDate(checkins[i - 1].createdAt);
      const curr = normalizeDate(checkins[i].createdAt);

      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    // 🔥 LONGEST STREAK
    let tempStreak = 1;

    for (let i = 1; i < checkins.length; i++) {

      const prev = normalizeDate(checkins[i - 1].createdAt);
      const curr = normalizeDate(checkins[i].createdAt);

      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    res.json({
      currentStreak,
      longestStreak
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch streak"
    });
  }
};

exports.getRiskSummary = async (req, res) => {
  try {
    const latestCheckin = await Checkin.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    const latestInsight = await Insight.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!latestCheckin || !latestInsight) {
      return res.status(404).json({
        message: "No data available"
      });
    }

    const riskLevel = latestInsight.riskExplanation.risk;

    // Convert ML risk into percentages
    const relapseRisk =
      riskLevel === "High Risk" ? 75 :
      riskLevel === "Medium Risk" ? 45 : 20;

    const glucoseSpike =
      latestCheckin.lateEating ? 60 : 25;

    const eveningInstability =
      latestCheckin.stress > 6 ? 55 : 20;

    const dropoutRisk =
      latestCheckin.activity < 20 ? 40 : 10;

    res.status(200).json({
      relapseRisk,
      glucoseSpike,
      eveningInstability,
      dropoutRisk
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch risk summary"
    });
  }
};