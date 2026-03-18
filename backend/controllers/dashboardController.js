const Checkin = require("../models/Checkin");
const Insight = require("../models/Insight");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch more records to ensure daily filtering works
    const rawCheckins = await Checkin.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30); // fetch more than 7 to filter unique days

    if (!rawCheckins.length) {
      return res.status(200).json({
        summary: null,
        trends: []
      });
    }

    // -------------------------------
    // Keep ONLY latest check-in per day
    // -------------------------------
    const dailyMap = {};

    rawCheckins.forEach((checkin) => {
      const dayKey = new Date(checkin.createdAt)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD

      // Since sorted DESC, first occurrence = latest of that day
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = checkin;
      }
    });

    // Convert to array
    const ordered = Object.values(dailyMap)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // chronological
      .slice(-7); // last 7 unique days

    // -------------------------------
    // Calculate averages
    // -------------------------------
    const avgStress =
      ordered.reduce((sum, c) => sum + c.stress, 0) / ordered.length;

    const avgSleep =
      ordered.reduce((sum, c) => sum + c.sleep, 0) / ordered.length;

    const avgActivity =
      ordered.reduce((sum, c) => sum + c.activity, 0) / ordered.length;

    const avgDiet =
      ordered.reduce((sum, c) => sum + c.diet, 0) / ordered.length;

    // Latest insight for phenotype
    const insight = await Insight.findOne({ userId }).sort({
      createdAt: -1
    });





// -------------------------------
// Trend calculation (compare last 2 days)
// -------------------------------
let trend = {
  stress: { direction: "stable", percent: 0 },
  sleep: { direction: "stable", percent: 0 },
  activity: { direction: "stable", percent: 0 },
  diet: { direction: "stable", percent: 0 }
};

if (ordered.length >= 2) {
  const last = ordered[ordered.length - 1];
  const prev = ordered[ordered.length - 2];

  const calcTrend = (current, previous) => {
    if (!previous) return { direction: "stable", percent: 0 };

    const diff = current - previous;
    const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : 0;

    return {
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
      percent: Math.abs(percent)
    };
  };

  trend.stress = calcTrend(last.stress, prev.stress);
  trend.sleep = calcTrend(last.sleep, prev.sleep);
  trend.activity = calcTrend(last.activity, prev.activity);
  trend.diet = calcTrend(last.diet, prev.diet);
}



    // -------------------------------
    // Trend data for charts
    // -------------------------------
    const trends = ordered.map((c) => {
      const date = new Date(c.createdAt);

      const day = date.toLocaleDateString("en-US", {
        weekday: "short"
      });

      const riskScore = Math.round(
        (c.stress * 3 + (10 - c.diet) * 2) / 2
      );

      return {
        day,
        stress: c.stress,
        sleep: c.sleep,
        activity: c.activity,
        risk: riskScore
      };
    });

    // -------------------------------
    // Summary Data
    // -------------------------------
    const summary = {
      stress: avgStress.toFixed(1),
      sleep: avgSleep.toFixed(1),
      activity: Math.round(avgActivity),
      diet: Math.round(avgDiet * 10),
      phenotype:
        insight?.behavioralPhenotype?.type || "Unknown"
    };

   res.status(200).json({
  summary,
  trends,
  trendInfo: trend,
  riskLevel: insight?.behavioralPhenotype?.risk || "Low Risk"
});

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data"
    });
  }
};