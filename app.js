const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const customerRoutes = require('./routes/customer');

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/customer', customerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://zhuopu:6q7bJf9zHDucA5eb@crud.wx203.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
