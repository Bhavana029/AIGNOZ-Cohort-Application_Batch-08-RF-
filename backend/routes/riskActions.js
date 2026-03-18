const express = require("express");
const router = express.Router();

const {
  getTodayPlan,
  startMorningWalk,
  setEveningReminder,
  getStreak,
  getRiskSummary
} = require("../controllers/riskActionController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/plan", authMiddleware, getTodayPlan);
router.post("/walk", authMiddleware, startMorningWalk);
router.post("/reminder", authMiddleware, setEveningReminder);
router.get("/streak", authMiddleware, getStreak);
router.get("/summary", authMiddleware, getRiskSummary);

module.exports = router;