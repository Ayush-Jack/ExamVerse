const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required']
  },
  examType: {
    type: String,
    enum: ['college', 'competitive'],
    default: 'college'
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdfURL: {
    type: String,
    required: [true, 'PDF URL is required']
  },
  pdfFileName: {
    type: String,
    required: true
  },
  solutionText: {
    type: String,
    default: ''
  },
  hasFacultySolution: {
    type: Boolean,
    default: false
  },
  // Individual questions with AI solutions
  questions: [{
    questionNumber: Number,
    questionText: String,
    marks: Number,
    aiSolution: {
      answer: String,
      generatedAt: Date,
      isGenerated: {
        type: Boolean,
        default: false
      }
    }
  }],
  
  // Custom queries by students
  aiGeneratedSolutions: [{
    question: String,
    answer: String,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
questionPaperSchema.index({ collegeName: 1, course: 1, year: 1 });
questionPaperSchema.index({ subject: 1 });
questionPaperSchema.index({ examType: 1 });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
