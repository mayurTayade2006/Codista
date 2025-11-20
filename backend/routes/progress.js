const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Get all progress for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const progressDocs = await Progress.find({ userId: req.user.id })
      .populate('courseId', 'title category') // Populate course details
      .sort({ lastAccessed: -1 });

    const formattedProgress = progressDocs.map(doc => {
        // Handle case where course might have been deleted but progress remains
        if (!doc.courseId) return null;
        
        return {
            id: doc._id,
            courseId: doc.courseId._id,
            courseTitle: doc.courseId.title,
            courseCategory: doc.courseId.category,
            videoViewed: doc.videoViewed,
            quizScore: doc.quizScore,
            totalQuestions: doc.totalQuestions,
            lastAccessed: doc.lastAccessed
        };
    }).filter(item => item !== null);

    res.json(formattedProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Video Progress (Mark as viewed)
router.post('/video', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id, courseId });

    if (progress) {
      progress.videoViewed = true;
      progress.lastAccessed = Date.now();
      await progress.save();
    } else {
      progress = new Progress({
        userId: req.user.id,
        courseId,
        videoViewed: true,
        lastAccessed: Date.now()
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Quiz Score
router.post('/quiz', auth, async (req, res) => {
  try {
    const { courseId, score, total } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id, courseId });

    if (progress) {
      // Only update if new score is better or if it's a retake (optional logic)
      // Here we just overwrite with the latest attempt
      progress.quizScore = score;
      progress.totalQuestions = total;
      progress.lastAccessed = Date.now();
      await progress.save();
    } else {
      progress = new Progress({
        userId: req.user.id,
        courseId,
        quizScore: score,
        totalQuestions: total,
        lastAccessed: Date.now()
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;