const connectTomongo = require('./dbconnection');
const User = require('./routes/authentication');
const product = require('./routes/products');
const question = require('./routes/question');
const response = require('./routes/response');
require('dotenv').config();
const express = require('express')
const cors = require('cors');
// Now we are using Express Framework of Node.Js
connectTomongo();

const app = express()
const port = process.env.PORT;


const allowedOrigins = [
  'http://localhost:3000',
  'https://heartfelt-praline-83b1d4.netlify.app',
  'https://heartfelt-praline-83b1d4.netlify.app/',
  'https://heartfelt-praline-83b1d4.netlify.app/login'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));



app.use(express.json());

app.use('/user',User);
app.use('/prod',product);
app.use('/questions',question);
app.use('/response', response);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
