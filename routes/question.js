const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { body, validationResult } = require('express-validator');

// Create Question
router.post('/create-question', [
  body().isArray({ min: 1 }).withMessage('Request body should be a non-empty array of questions'),
  body('*.text').notEmpty().withMessage('Question text is required'),
  body('*.productId').notEmpty().withMessage('Product ID is required'),
  body('*.type').isIn(["text", "radio", "checkbox", "dropdown"]).withMessage('Type must be one of text, radio, checkbox, dropdown'),
  body('*.stepNumber').isInt({ min: 1 }).withMessage('stepNumber must be a positive integer'),
  body('*.options').custom((value, { req, path }) => {
    const index = path.match(/\d+/)[0];
    const question = req.body[index];
    if (["radio", "checkbox", "dropdown"].includes(question.type)) {
      if (!Array.isArray(question.options) || question.options.length === 0) {
        throw new Error('Options are required for radio, checkbox, and dropdown types');
      }
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const questions = await Question.insertMany(req.body);
    res.status(201).json({ success: true, questions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error creating questions' });
  }
});


// Get Questions by Product ID
router.get('/all-ques/:productId', async (req, res) => {
  try {
    const questions = await Question.find({ productId: req.params.productId });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});


module.exports = router;
