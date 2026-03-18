const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  stress: Number,
  mood: Number,
  sleep: Number,
  activity: Number,
  diet: Number,

  lateEating: Boolean,
  medication: Boolean,

  prediction: String,
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Checkin", checkinSchema);