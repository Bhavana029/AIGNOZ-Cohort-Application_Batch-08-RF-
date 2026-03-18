const Insight = require("../models/Insight");

/*
---------------------------------------------------
GENERATE & SAVE INSIGHTS
---------------------------------------------------
*/

exports.generateInsights = async (
  userId,
  riskLevel,
  stress,
  mood,
  sleep,
  activity,
  diet,
  lateEating
) => {

  try {

const insights = {

  behavioralPhenotype: {
    type: riskLevel === "Low Risk" ? "Resilient" : "Vulnerable",
    text:
      riskLevel === "Low Risk"
        ? "You exhibit a Resilient phenotype — you recover quickly from stress events and maintain stable behavioral patterns."
        : "Your behavior suggests vulnerability to stress events and slower recovery patterns.",
    risk: riskLevel
  },

  emotionalPattern: {
    text:
      mood >= 3
        ? "Your emotional patterns show consistency with generally positive moods."
        : "Mood fluctuations indicate emotional variability.",
    risk: mood >= 3 ? "Low Risk" : "Medium Risk"
  },

  stressSleepCorrelation: {
    text:
      stress > 6
        ? "There is a noticeable correlation between higher stress and reduced sleep."
        : "Stress levels currently do not significantly affect your sleep patterns.",
    risk: stress > 6 ? "Medium Risk" : "Low Risk"
  },

  lifestyleScore: {
    score: Math.round((diet * 10 + activity / 2 + (lateEating ? 0 : 10)) / 3),
    risk: lateEating ? "Medium Risk" : "Low Risk"
  },

  riskExplanation: {
    text:
      riskLevel === "High Risk"
        ? "Your behavioral patterns suggest an elevated health risk."
        : "Your current lifestyle patterns indicate relatively low behavioral health risk.",
    risk: riskLevel
  }

};
const newInsight = new Insight({
  userId,
  behavioralPhenotype: insights.behavioralPhenotype,
  emotionalPattern: insights.emotionalPattern,
  stressSleepCorrelation: insights.stressSleepCorrelation,
  lifestyleScore: insights.lifestyleScore,
  riskExplanation: insights.riskExplanation
});

    await newInsight.save();

    return insights;

  } catch (error) {

    console.error("Insight generation error:", error);

    throw new Error("Failed to generate insights");

  }

};


/*
---------------------------------------------------
GET LATEST USER INSIGHTS
---------------------------------------------------
*/

exports.getInsights = async (req, res) => {

  try {

    const insights = await Insight.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!insights.length) {

      return res.status(404).json({
        message: "No insights found",
        data: null
      });

    }

    res.status(200).json({
      message: "Insights fetched successfully",
      data: insights[0]
    });

  } catch (error) {

    console.error("Insight fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch insights"
    });

  }

};