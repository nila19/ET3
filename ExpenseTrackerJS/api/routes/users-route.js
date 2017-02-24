'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');

router.use(function init(req, res, next) {
  req.app.locals.log.info('Router >User< invoked... authenticated= ' + res.locals.authenticated);
  res.locals.authenticated = true;
  next();
});

router.all('*', function all(req, res, next) {
  req.app.locals.log.info('All routes need to go through this...');
  next();
});

/* 'GET' users listing. */
router.get('/', function base(req, res, next) {
  req.app.locals.log.info('Get on >User<... authenticated= ' + res.locals.authenticated);
  res.send('Responding with a resource.. >> ' + req.app.locals.owner + ' :: ' + JSON.stringify(req.app.locals.site));
});

router.use(error.inject404());

module.exports = router;
