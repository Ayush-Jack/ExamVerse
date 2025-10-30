const { GoogleGenerativeAI } = require('@google/generative-ai');
const QuestionPaper = require('../models/QuestionPaper');

// Initialize Gemini AI (only if API key is provided)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// @desc    Generate AI solution for a question
// @route   POST /api/ai/generate-solution
// @access  Private
exports.generateSolution = async (req, res) => {
  try {
    const { question, paperId, subject } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a detailed prompt
    const prompt = `You are an expert ${subject || 'academic'} tutor. A student has asked the following question from their exam paper:

Question: ${question}

Please provide a detailed, step-by-step solution that:
1. Explains the concept clearly
2. Shows all working steps
3. Provides the final answer
4. Includes any relevant formulas or theories

Keep the explanation student-friendly and educational.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // If paperId is provided, save the AI solution
    if (paperId) {
      const paper = await QuestionPaper.findById(paperId);
      
      if (paper) {
        paper.aiGeneratedSolutions.push({
          question,
          answer,
          generatedAt: new Date()
        });
        await paper.save();
      }
    }

    res.status(200).json({
      success: true,
      question,
      answer,
      isAIGenerated: true
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI solution. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get saved AI solutions for a paper
// @route   GET /api/ai/solutions/:paperId
// @access  Private
exports.getSavedSolutions = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.paperId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Question paper not found'
      });
    }

    res.status(200).json({
      success: true,
      solutions: paper.aiGeneratedSolutions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate summary of a topic
// @route   POST /api/ai/summarize
// @access  Private
exports.summarizeTopic = async (req, res) => {
  try {
    const { topic, subject } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Provide a concise summary of the following ${subject || ''} topic for exam preparation:

Topic: ${topic}

Include:
- Key concepts
- Important formulas (if applicable)
- Common exam questions
- Quick revision points`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      topic,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
