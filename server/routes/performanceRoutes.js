// AI recommendation routes
const express = require('express');
const router = express.Router();
const { aiRecommend } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

// AI-powered recommendation
router.post('/ai/recommend', aiRecommend);

module.exports = router;
