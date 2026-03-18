const express = require("express");
const router = express.Router();
const { getWeeklyReport ,downloadWeeklyReport} = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/weekly", authMiddleware, getWeeklyReport);
router.get("/weekly/pdf", authMiddleware, downloadWeeklyReport);
module.exports = router;