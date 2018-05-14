'use strict'
/* dependencies */
const config = require('../config');
const bodyParser = require('body-parser');
const express = require('express');
const model = require('./model');
const path = require('path')
const logger = require('./logger');
const apiRouter = require('./api').router;

// Create an Express application.
const app = express();

// Add body parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// debug request
app.use((req, res, next) => {
  logger.debug('querySets')
  logger.debug(req.query)
  logger.debug('postSets')
  logger.debug(req.body)
  return next()
})

// Add routers
app.use('/v1', apiRouter);
app.get('/', (req, res) => res.redirect('/status'))
app.get('/status', (req, res)=> res.json({status: 0}))

app.use((req, res, next) => res.send("404"))
app.use((err, req, res, next) => {
  logger.error(err)
  if (res.headerSent) return next(err)
  return res.send("500")
})

process.once('SIGINT', (code) => {
  logger.warn('SIGINT received...');
  process.exit(1)
});

process.once('SIGTERM', (code) => {
  logger.warn('SIGTERM received...');
  process.exit(2)
});

module.exports = app;

