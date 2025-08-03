const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const { body, validationResult } = require('express-validator');
const { getUserResponsePDF } = require('../utills/generatepdf');

router.get('/user/responses/pdf/:userId', getUserResponsePDF);

// Create Response
router.post('/give-response', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('userName').notEmpty().withMessage('User name is required'),
  body('answers').isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),
  body('answers.*.questionId').notEmpty().withMessage('Each answer must have a questionId'),
  body('answers.*.questionText').notEmpty().withMessage('Each answer must have questionText'),
  body('answers.*.answer').notEmpty().withMessage('Each answer must contain a response')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const response = await Response.create(req.body);
    res.status(201).json({ success: true, response });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error creating response' });
  }
});



// GET all question-answers for a given userId
// Get all questions and answers by userId
router.get('/user/:userId/responses', async (req, res) => {
  try {
    const response = await Response.findOne({ userId: req.params.userId });

    if (!response) {
      return res.status(404).json({ message: 'No responses found for this user.' });
    }

    return res.status(200).json({
      success: true,
      userId: response.userId,
      userName: response.userName,
      productId: response.productId,
      answers: response.answers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch user responses.' });
  }
});




module.exports = router;
