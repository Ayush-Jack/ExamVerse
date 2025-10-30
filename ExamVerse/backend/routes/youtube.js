const express = require('express');
const { searchVideos } = require('../controllers/youtubeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/search', protect, searchVideos);

module.exports = router;
