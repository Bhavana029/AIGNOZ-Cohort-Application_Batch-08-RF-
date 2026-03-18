const express = require("express");
const router = express.Router();

const { submitCheckin } = require("../controllers/checkinController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/submit", authMiddleware, submitCheckin);

module.exports = router;