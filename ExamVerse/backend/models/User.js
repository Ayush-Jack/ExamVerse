const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'faculty'],
    default: 'student'
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  course: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  year: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  isVerified: {
    type: Boolean,
    default: true  // Auto-verify all users (no admin panel needed)
  },
  savedPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPaper'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
