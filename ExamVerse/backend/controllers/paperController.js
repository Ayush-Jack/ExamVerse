const QuestionPaper = require('../models/QuestionPaper');
const User = require('../models/User');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

// @desc    Get all question papers with filters
// @route   GET /api/papers
// @access  Private
exports.getPapers = async (req, res) => {
  try {
    const { collegeName, course, year, subject, examType, search } = req.query;
    
    let query = {};

    // Build query based on filters
    if (collegeName) query.collegeName = collegeName;
    if (course) query.course = course;
    if (year) query.year = year;
    if (subject) query.subject = new RegExp(subject, 'i');
    if (examType) query.examType = examType;
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') }
      ];
    }

    const papers = await QuestionPaper.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: papers.length,
      papers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single question paper
// @route   GET /api/papers/:id
// @access  Private
exports.getPaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id)
      .populate('uploadedBy', 'name email collegeName');

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    // Increment views
    paper.views += 1;
    await paper.save();

    res.status(200).json({
      success: true,
      paper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload question paper
// @route   POST /api/papers
// @access  Private (Faculty only)
exports.uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const { title, subject, year, examType, course, solutionText } = req.body;

    // Create paper
    // Parse questions if provided
    let questions = [];
    if (req.body.questions) {
      try {
        questions = JSON.parse(req.body.questions);
      } catch (e) {
        console.log('Error parsing questions:', e);
      }
    }

    // If no manual questions, try OCR extraction
    if (questions.length === 0) {
      try {
        console.log('🔍 Attempting PDF text extraction...');
        const pdfPath = path.join(__dirname, '..', 'uploads', req.file.filename);
        console.log('📄 PDF path:', pdfPath);
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
        console.log('📖 Extracted text length:', pdfData.text.length);
        console.log('📖 First 500 chars:', pdfData.text.substring(0, 500));
        questions = extractQuestionsFromText(pdfData.text);
        console.log(`📝 Extracted ${questions.length} questions from PDF`);
        if (questions.length > 0) {
          console.log('First question:', questions[0]);
        }
      } catch (error) {
        console.log('❌ OCR extraction failed:', error.message);
        console.error(error);
      }
    } else {
      console.log(`✅ Using ${questions.length} manually added questions`);
    }

    const paper = await QuestionPaper.create({
      title,
      subject,
      year,
      examType: examType || 'college',
      collegeName: req.user.collegeName,
      course,
      uploadedBy: req.user.id,
      pdfURL: `/uploads/${req.file.filename}`,
      pdfFileName: req.file.originalname,
      solutionText,
      hasFacultySolution: solutionText ? true : false,
      questions: questions
    });

    res.status(201).json({
      success: true,
      message: 'Question paper uploaded successfully',
      paper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update question paper
// @route   PUT /api/papers/:id
// @access  Private (Faculty - own papers only)
exports.updatePaper = async (req, res) => {
  try {
    let paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    // Check ownership
    if (paper.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    const { title, subject, year, solutionText } = req.body;

    paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subject,
        year,
        solutionText,
        hasFacultySolution: solutionText ? true : false
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Paper updated successfully',
      paper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete question paper
// @route   DELETE /api/papers/:id
// @access  Private (Faculty - own papers only)
exports.deletePaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    // Check ownership
    if (paper.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this paper'
      });
    }

    // Delete PDF file
    const filePath = path.join(__dirname, '..', paper.pdfURL);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await paper.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment download count
// @route   POST /api/papers/:id/download
// @access  Private
exports.incrementDownload = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    paper.downloads += 1;
    await paper.save();

    res.status(200).json({
      success: true,
      downloads: paper.downloads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle upvote on paper
// @route   POST /api/papers/:id/upvote
// @access  Private
exports.toggleUpvote = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    const hasUpvoted = paper.upvotedBy.includes(req.user.id);

    if (hasUpvoted) {
      // Remove upvote
      paper.upvotedBy = paper.upvotedBy.filter(
        userId => userId.toString() !== req.user.id
      );
      paper.upvotes -= 1;
    } else {
      // Add upvote
      paper.upvotedBy.push(req.user.id);
      paper.upvotes += 1;
    }

    await paper.save();

    res.status(200).json({
      success: true,
      upvotes: paper.upvotes,
      hasUpvoted: !hasUpvoted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save/unsave paper to user's favorites
// @route   POST /api/papers/:id/save
// @access  Private
exports.toggleSavePaper = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const paperId = req.params.id;

    const isSaved = user.savedPapers.includes(paperId);

    if (isSaved) {
      user.savedPapers = user.savedPapers.filter(
        id => id.toString() !== paperId
      );
    } else {
      user.savedPapers.push(paperId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savedPapers: user.savedPapers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
