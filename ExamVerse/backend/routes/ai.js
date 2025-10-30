const express = require('express');
const {
  generateSolution,
  getSavedSolutions,
  summarizeTopic
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate-solution', protect, generateSolution);
router.get('/solutions/:paperId', protect, getSavedSolutions);
router.post('/summarize', protect, summarizeTopic);

module.exports = router;
