require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const voterRoutes = require('./routes/voters');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/voters', voterRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });
