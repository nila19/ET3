'use strict';

const numeral = require('numeral');
const accounts = require('../models/Accounts')();
const cities = require('../models/Cities')();
const categories = require('../models/Categories')();
const transactions = require('../models/Transactions')();
const monthUtils = require('../utils/month-utils');
const cu = require('../utils/common-utils');
const config = require('../config/config');

const canConnect = function (req, resp) {
  accounts.findById(req.app.locals.db, 0).then(() => {
    return resp.json({code: 0, data: {env: config.env}});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: config.error});
  });
};

// **************************** city ****************************//
const getAllCities = function (req, resp) {
  const promise = cities.findAllCities(req.app.locals.db);

  return cu.sendJson(promise, resp, req.app.locals.log);
};
const getDefaultCity = function (req, resp) {
  const promise = cities.findDefault(req.app.locals.db);

  return cu.sendJson(promise, resp, req.app.locals.log);
};
const getCityById = function (req, resp, cityId) {
  const promise = cities.findById(req.app.locals.db, cityId);

  return cu.sendJson(promise, resp, req.app.locals.log);
};

// **************************** account ****************************//
const getActiveAccounts = function (req, resp) {
  const promise = accounts.findForCityActive(req.app.locals.db, numeral(req.query.cityId).value());

  return cu.sendJson(promise, resp, req.app.locals.log);
};
const getInactiveAccounts = function (req, resp) {
  const promise = accounts.findForCityInactive(req.app.locals.db, numeral(req.query.cityId).value());

  return cu.sendJson(promise, resp, req.app.locals.log);
};

// **************************** categories ****************************//
const getAllCategories = function (req, resp) {
  const promise = categories.findForCity(req.app.locals.db, numeral(req.query.cityId).value());

  return cu.sendJson(promise, resp, req.app.locals.log);
};
const getCategories = function (req, resp) {
  const promise = categories.findForCityActive(req.app.locals.db, numeral(req.query.cityId).value());

  return cu.sendJson(promise, resp, req.app.locals.log);
};

// **************************** description ****************************//
const getDescriptions = function (req, resp) {
  transactions.findAllDescriptions(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    const desc = docs.map(function (a) {
      return a['_id'];
    });

    return resp.json({code: 0, data: desc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: config.error});
  });
};

// **************************** months ****************************//
const getEntryMonths = function (req, resp) {
  const promise = transactions.findAllEntryMonths(req.app.locals.db, numeral(req.query.cityId).value());

  return sendMonthsList(promise, resp, req.app.locals.log);
};

const getTransMonths = function (req, resp) {
  const promise = transactions.findAllTransMonths(req.app.locals.db, numeral(req.query.cityId).value());

  return sendMonthsList(promise, resp, req.app.locals.log);
};

// utility method.
const sendMonthsList = function (promise, resp, log) {
  promise.then((docs) => {
    return monthUtils.buildMonthsList(docs, log);
  }).then((months) => {
    return resp.json({code: 0, data: months});
  }).catch((err) => {
    log.error(err);
    return resp.json({code: config.error});
  });
};

module.exports = {
  canConnect: canConnect,
  getAllCities: getAllCities,
  getDefaultCity: getDefaultCity,
  getCityById: getCityById,
  getActiveAccounts: getActiveAccounts,
  getInactiveAccounts: getInactiveAccounts,
  getAllCategories: getAllCategories,
  getCategories: getCategories,
  getDescriptions: getDescriptions,
  getEntryMonths: getEntryMonths,
  getTransMonths: getTransMonths
};
