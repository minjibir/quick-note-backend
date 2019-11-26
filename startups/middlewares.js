require('express-async-errors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');

module.exports = (app) => {
   app.use(helmet());
   if (process.env.NODE_ENV !== 'production')
      app.use(morgan('dev'));
   app.use(express.json());
};
