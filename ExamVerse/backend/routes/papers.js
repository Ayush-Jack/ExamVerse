const express = require('express');
const {
  getPapers,
  getPaper,
  uploadPaper,
  updatePaper,
  deletePaper,
  incrementDownload,
  toggleUpvote,
  toggleSavePaper
} = require('../controllers/paperController');
const { protect, authorize, checkVerified } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'paper-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public routes (require authentication)
router.get('/', protect, getPapers);
router.get('/:id', protect, getPaper);
router.post('/:id/download', protect, incrementDownload);
router.post('/:id/upvote', protect, toggleUpvote);
router.post('/:id/save', protect, toggleSavePaper);

// Faculty routes
router.post('/', protect, authorize('faculty'), upload.single('pdf'), uploadPaper);
router.put('/:id', protect, authorize('faculty'), updatePaper);
router.delete('/:id', protect, authorize('faculty'), deletePaper);

module.exports = router;
