const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  videoViewed: {
    type: Boolean,
    default: false
  },
  quizScore: {
    type: Number,
    default: null
  },
  totalQuestions: {
    type: Number,
    default: null
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user only has one progress document per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);