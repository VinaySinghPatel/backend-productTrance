const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional (if using auth)
  userName: { type: String, required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      questionText: String,
      answer: String
    }
  ],
  reportGenerated: { type: Boolean, default: false }, // new field
  pdfPath: { type: String }, // new field (if you save to disk/cloud)
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Response", responseSchema);
