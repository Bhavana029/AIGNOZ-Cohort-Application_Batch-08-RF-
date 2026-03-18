const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  behavioralPhenotype: {
    type: {
    type: String
  },
    text: String,
    risk: String
  },

  emotionalPattern: {
    text: String,
    risk: String
  },

  stressSleepCorrelation: {
    text: String,
    risk: String
  },

  lifestyleScore: {
    score: Number,
    risk: String
  },

  riskExplanation: {
    text: String,
    risk: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Insight", insightSchema);