const Checkin = require("../models/Checkin");

exports.getRecommendations = async (req, res) => {
  try {

    const latestCheckin = await Checkin.findOne({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    if (!latestCheckin) {
      return res.status(404).json({
        message: "No check-in found",
        data: []
      });
    }

    const recs = [];

    // 1️⃣ Stress-based recommendation
    if (latestCheckin.stress > 6) {
      recs.push({
        title: "Stress Reduction Activity",
        description: "Try 4-7-8 breathing exercise to calm your nervous system.",
        type: "stress"
      });
    }

    // 2️⃣ Sleep recommendation
    if (latestCheckin.sleep < 6) {
      recs.push({
        title: "Sleep Optimization",
        description: "Aim for 7–8 hours of sleep. Avoid screens 30 minutes before bed.",
        type: "sleep"
      });
    }

    // 3️⃣ Activity recommendation
    if (latestCheckin.activity < 30) {
      recs.push({
        title: "Increase Activity",
        description: "Walk at least 8,000 steps or 45 minutes today.",
        type: "activity"
      });
    }

    // 4️⃣ Diet recommendation
    if (latestCheckin.diet < 5 || latestCheckin.lateEating) {
      recs.push({
        title: "Improve Diet",
        description: "Avoid late-night eating and include omega-3 rich foods.",
        type: "diet"
      });
    }

    // 5️⃣ Positive reinforcement (important!)
    if (recs.length === 0) {
      recs.push({
        title: "Great Job!",
        description: "Your recent behavioral patterns look healthy. Keep maintaining this balance.",
        type: "positive"
      });
    }

    res.status(200).json({
      message: "Recommendations generated successfully",
      data: recs
    });

  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      message: "Failed to generate recommendations"
    });
  }
};