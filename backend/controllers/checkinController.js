const Checkin = require("../models/Checkin");
const { predictHealth } = require("../services/mlService");
const { generateInsights } = require("./insightController");
exports.submitCheckin = async (req, res) => {

  try {

    const {
      stress,
      mood,
      sleep,
      activity,
      diet,
      lateEating,
      medication
    } = req.body;

    // Validate required fields
    if (
      stress === undefined ||
      mood === undefined ||
      sleep === undefined ||
      activity === undefined ||
      diet === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Convert string values to numbers
    const sleepHours = Number(sleep);
    const activityMinutes = Number(activity);

    // Call ML service
const mlResult = await predictHealth({
  stress,
  mood,
  sleep: sleepHours,
  activity: activityMinutes,
  diet,
  lateEating,
  medication
});

console.log("ML Full Response:", mlResult);

const predictionMap = {
  0: "Low Risk",
  1: "Medium Risk",
  2: "High Risk"
};

const riskLevel = predictionMap[mlResult.prediction] || "Medium Risk";

const insights = await generateInsights(
  req.user.id,
  riskLevel,
  stress,
  mood,
  sleepHours,
  activityMinutes,
  diet,
  lateEating
);


await Checkin.create({
  userId: req.user.id,
  stress,
  mood,
  sleep: sleepHours,
  activity: activityMinutes,
  diet,
  lateEating,
  medication
});


res.status(200).json({
  message: "Analysis completed successfully",
  prediction: mlResult.prediction,
  insights
});

  } catch (error) {

    console.error("Check-in Error:", error);

    res.status(500).json({
      message: "Check-in failed",
      error: error.message
    });

  }

};