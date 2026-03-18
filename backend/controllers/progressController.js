
const PDFDocument = require("pdfkit");
const Checkin = require("../models/Checkin");
const Insight = require("../models/Insight");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");


exports.getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recent checkins
    const rawCheckins = await Checkin.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    if (!rawCheckins.length) {
      return res.status(200).json({
        message: "No weekly data available",
        weeklyData: [],
        stats: null,
        summary: "No data available for this week."
      });
    }

    // Keep only latest checkin per day
    const dailyMap = {};

    rawCheckins.forEach((c) => {
      const dayKey = new Date(c.createdAt)
        .toISOString()
        .split("T")[0];

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = c;
      }
    });

    const ordered = Object.values(dailyMap)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-7);

    // Build weekly chart data
    const weeklyData = ordered.map((c) => {
      const day = new Date(c.createdAt).toLocaleDateString("en-US", {
        weekday: "short"
      });

      const adherence = Math.round(
        (c.diet * 10 + c.activity / 2 + (c.lateEating ? 0 : 10)) / 3
      );

      return {
        day,
        stress: c.stress,
        sleep: c.sleep,
        adherence
      };
    });

    // Calculate stats
    const avgStress =
      ordered.reduce((sum, c) => sum + c.stress, 0) / ordered.length;

    const sleepConsistency =
      (ordered.filter((c) => c.sleep >= 7).length / ordered.length) * 100;

    const adherenceRate =
      weeklyData.reduce((sum, d) => sum + d.adherence, 0) / weeklyData.length;

    const stats = {
      weeklyStressAvg: avgStress.toFixed(1),
      sleepConsistency: Math.round(sleepConsistency),
      adherenceRate: Math.round(adherenceRate),
      riskImprovement: "-10%" // optional placeholder
    };

    const summary = `
This week showed moderate behavioral stability.
Average stress was ${avgStress.toFixed(1)}/10.
Sleep consistency reached ${Math.round(sleepConsistency)}%.
Overall adherence rate was ${Math.round(adherenceRate)}%.
Overall trajectory: ${avgStress < 5 ? "Positive" : "Needs Attention"}.
`;

    res.status(200).json({
      message: "Weekly report fetched successfully",
      weeklyData,
      stats,
      summary
    });

  } catch (error) {
    console.error("Weekly Report Error:", error);

    res.status(500).json({
      message: "Failed to fetch weekly report"
    });
  }
};





exports.downloadWeeklyReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch recent checkins (same logic as getWeeklyReport)
    const rawCheckins = await Checkin.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    if (!rawCheckins.length) {
      return res.status(404).json({ message: "No data available" });
    }

    // Keep latest checkin per day
    const dailyMap = {};
    rawCheckins.forEach((c) => {
      const dayKey = new Date(c.createdAt)
        .toISOString()
        .split("T")[0];

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = c;
      }
    });

    const ordered = Object.values(dailyMap)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-7);

    // ------------------------------------
    // SAME CALCULATIONS AS PROGRESS PAGE
    // ------------------------------------

    const weeklyData = ordered.map((c) => {
      const day = new Date(c.createdAt).toLocaleDateString("en-US", {
        weekday: "short"
      });

      const adherence = Math.round(
        (c.diet * 10 + c.activity / 2 + (c.lateEating ? 0 : 10)) / 3
      );

      return {
        day,
        stress: c.stress,
        sleep: c.sleep,
        adherence
      };
    });

    const avgStress =
      ordered.reduce((sum, c) => sum + c.stress, 0) / ordered.length;

    const sleepConsistency =
      (ordered.filter((c) => c.sleep >= 7).length / ordered.length) * 100;

    const adherenceRate =
      weeklyData.reduce((sum, d) => sum + d.adherence, 0) / weeklyData.length;

    const stats = {
      weeklyStressAvg: avgStress.toFixed(1),
      sleepConsistency: Math.round(sleepConsistency),
      adherenceRate: Math.round(adherenceRate),
      riskImprovement: "-10%" // keep same placeholder as UI
    };

    const summary = `
This week showed moderate behavioral stability.
Average stress was ${avgStress.toFixed(1)}/10.
Sleep consistency reached ${Math.round(sleepConsistency)}%.
Overall adherence rate was ${Math.round(adherenceRate)}%.
Overall trajectory: ${avgStress < 5 ? "Positive" : "Needs Attention"}.
`;

    // ------------------------------------
    // Generate Chart Image (same data)
    // ------------------------------------

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 600,
      height: 300
    });

    const chartConfig = {
      type: "bar",
      data: {
        labels: weeklyData.map((d) => d.day),
        datasets: [
          {
            label: "Adherence",
            data: weeklyData.map((d) => d.adherence),
            backgroundColor: "rgba(54, 162, 235, 0.8)"
          }
        ]
      }
    };

    const chartImage = await chartJSNodeCanvas.renderToBuffer(chartConfig);

    // ------------------------------------
    // Create PDF
    // ------------------------------------

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly_report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(22).text("Weekly Behavioral Health Report", {
      align: "center"
    });

    doc.moveDown(2);

    doc.fontSize(16).text("Weekly Summary");
    doc.moveDown();

    doc.fontSize(12).text(
      `Average Stress: ${stats.weeklyStressAvg}/10`
    );
    doc.text(`Sleep Consistency: ${stats.sleepConsistency}%`);
    doc.text(`Adherence Rate: ${stats.adherenceRate}%`);
    doc.text(`Risk Improvement: ${stats.riskImprovement}`);

    doc.moveDown(2);

    doc.fontSize(16).text("AI-Generated Summary");
    doc.moveDown();

    doc.fontSize(12).text(summary.trim());

    doc.moveDown(2);

    doc.fontSize(16).text("Weekly Overview Chart");
    doc.moveDown();

    doc.image(chartImage, {
      fit: [500, 250],
      align: "center"
    });

    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};