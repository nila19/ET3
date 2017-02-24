'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');
const loginctrl = require('../controllers/LoginCtrl');

router.use(function init(req, res, next) {
  req.app.locals.log.info('Router >User< invoked... authenticated= ' + res.locals.authenticated);
  res.locals.authenticated = true;
  next();
});

router.all('*', function all(req, res, next) {
  req.app.locals.log.info('All routes need to go through this... : ' + req.originalUrl + ' :: ' + req.method);
  next();
});

/* 'GET' users listing. */
router.post('/in', function login(req, res, next) {
  loginctrl.checkLogin(req, res);
});

router.post('/checkName', function checkName(req, res, next) {
  loginctrl.checkName(req, res);
});

router.use(error.inject404());

module.exports = router;
