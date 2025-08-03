const PDFDocument = require('pdfkit');
const Response = require('../models/Response');
const Product = require('../models/Product');
const Question = require('../models/Question');
const User = require('../models/User');

const getUserResponsePDF = async (req, res) => {
  try {
    const userId = req.params.userId;

    const response = await Response.findOne({ userId });
    if (!response) {
      return res.status(404).json({ message: 'No responses found for this user.' });
    }

    const user = await User.findById(userId);
    const product = await Product.findById(response.productId);

    const questionIds = response.answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = {};
    questions.forEach(q => questionMap[q._id.toString()] = q.text);

    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=user_responses.pdf');
      res.send(result);
    });

    doc.fontSize(20).text('User Response Report', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`User: ${user?.name || 'N/A'} (${user?.email || 'N/A'})`);
    doc.text(`Product: ${product?.name || 'N/A'}`).moveDown();

    response.answers.forEach((a, i) => {
      doc.fontSize(14).text(`Q${i + 1}: ${questionMap[a.questionId.toString()] || 'Question not found'}`);
      doc.fontSize(12).text(`Answer: ${a.answer}`).moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate PDF.' });
  }
};

module.exports = { getUserResponsePDF };
