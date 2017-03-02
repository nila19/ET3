'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');
const startup = require('../controllers/StartupController');

router.use(function init(req, res, next) {
  res.locals.authenticated = true;
  next();
});

router.all('*', function all(req, res, next) {
  next();
});

router.get('/connect', function canConnect(req, res, next) {
  startup.canConnect(req, res);
});

router.get('/cities', function getAllCities(req, res, next) {
  startup.getAllCities(req, res);
});

router.get('/city/default', function defaultCity(req, res, next) {
  startup.getDefaultCity(req, res);
});

router.get('/city/:cityId', function getCiity(req, res, next) {
  startup.getCityById(req, res, req.params.cityId);
});

router.get('/accounts', function getActiveAccounts(req, res, next) {
  startup.getActiveAccounts(req, res);
});

router.get('/accounts/inactive', function getInctiveAccounts(req, res, next) {
  startup.getInactiveAccounts(req, res);
});

router.get('/categories/all', function getAllCategories(req, res, next) {
  startup.getAllCategories(req, res);
});

router.get('/categories', function getActiveCategories(req, res, next) {
  startup.getActiveCategories(req, res);
});

router.get('/descriptions', function getDescriptions(req, res, next) {
  startup.getDescriptions(req, res);
});

router.get('/months/entry', function getEntryMonths(req, res, next) {
  startup.getEntryMonths(req, res);
});

router.get('/months/trans', function getTransMonths(req, res, next) {
  startup.getTransMonths(req, res);
});

router.use(error.inject404());

module.exports = router;
