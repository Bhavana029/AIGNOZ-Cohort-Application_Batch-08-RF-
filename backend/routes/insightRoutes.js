const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/insightController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/insights", authMiddleware, getInsights);
router.get("/test", (req,res)=>{
  res.send("Insight route working");
});
module.exports = router;