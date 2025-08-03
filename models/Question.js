const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ["text", "radio", "checkbox", "dropdown"], required: true },
  options: [String], // used for radio/checkbox/dropdown
  stepNumber: { type: Number, required: true }, // for form flow
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
