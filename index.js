const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectTomongo = require('./dbconnection');
const User = require('./routes/authentication');
const product = require('./routes/products');
const question = require('./routes/question');
const response = require('./routes/response');

connectTomongo();
const app = express();
const port = process.env.PORT;

// ✅ Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://heartfelt-praline-83b1d4.netlify.app'
];

// ✅ Setup CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// ✅ Handle preflight OPTIONS request globally
app.options('*', cors());

// ✅ Express Middleware
app.use(express.json());

// ✅ API Routes
app.use('/user', User);
app.use('/prod', product);
app.use('/questions', question);
app.use('/response', response);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
