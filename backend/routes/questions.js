const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
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

// Get questions for a course
router.get('/:courseId', async (req, res) => {
  try {
    const questions = await Question.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 });
    
    // Map _id to id for frontend consistency
    const formattedQuestions = questions.map(q => ({
      id: q._id,
      courseId: q.courseId,
      userId: q.userId,
      userName: q.userName,
      text: q.text,
      createdAt: q.createdAt,
      replies: q.replies.map(r => ({
        id: r._id,
        userId: r.userId,
        userName: r.userName,
        userRole: r.userRole,
        text: r.text,
        createdAt: r.createdAt
      }))
    }));

    res.json(formattedQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Post a new question (Student only usually, but anyone can ask)
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, text } = req.body;
    // Optional: Fetch user name again or trust token? Trusting token/req.user if enriched, 
    // but we need the name. Let's fetch user to be safe or pass it in body.
    // Since we don't have user name in token usually (just id/role), we fetch user.
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    const newQuestion = new Question({
      courseId,
      userId: req.user.id,
      userName: user.name,
      text,
      replies: []
    });

    const savedQuestion = await newQuestion.save();
    res.json({
        id: savedQuestion._id,
        courseId: savedQuestion.courseId,
        userId: savedQuestion.userId,
        userName: savedQuestion.userName,
        text: savedQuestion.text,
        createdAt: savedQuestion.createdAt,
        replies: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Post a reply (Instructor only)
router.post('/:id/reply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ message: 'Only instructors can reply to questions.' });
    }

    const { text } = req.body;
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newReply = {
      userId: req.user.id,
      userName: user.name,
      userRole: user.role,
      text
    };

    question.replies.push(newReply);
    await question.save();

    // Return the last reply with its ID
    const savedReply = question.replies[question.replies.length - 1];
    
    res.json({
      id: savedReply._id,
      userId: savedReply.userId,
      userName: savedReply.userName,
      userRole: savedReply.userRole,
      text: savedReply.text,
      createdAt: savedReply.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;