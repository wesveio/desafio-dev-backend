'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// load Models
const User = require('./models/user');
const Group = require('./models/group');

// load routes
const indexRoute = require('./routes/index-route');
const userRoute = require('./routes/user-route');
const groupRoute = require('./routes/group-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/groups', groupRoute);

module.exports = app;