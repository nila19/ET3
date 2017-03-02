'use strict';

const accounts = require('../models/Accounts')();
const cities = require('../models/Cities')();
const categories = require('../models/Categories')();
const transactions = require('../models/Transactions')();
const error = 1000;

const canConnect = function (req, resp) {
  accounts.findOne(req.app.locals.db, {}).then(() => {
    return resp.json({code: 0, data: true});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error, data: false});
  });
};

// **************************** city ****************************//
const getAllCities = function (req, resp) {
  cities.findAll(req.app.locals.db).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getDefaultCity = function (req, resp) {
  cities.findDefault(req.app.locals.db).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getCityById = function (req, resp, cityId) {
  cities.findOne(req.app.locals.db, {cityId: cityId}).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** account ****************************//
const getActiveAccounts = function (req, resp) {
  accounts.findForCityActive(req.app.locals.db, req.body.cityId).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getInactiveAccounts = function (req, resp) {
  accounts.findForCityInactive(req.app.locals.db, req.body.cityId).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** categories ****************************//
const getAllCategories = function (req, resp) {
  categories.findForCity(req.app.locals.db, req.body.cityId).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getActiveCategories = function (req, resp) {
  categories.findForCityActive(req.app.locals.db, req.body.cityId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** description ****************************//
const getDescriptions = function (req, resp) {
  transactions.findAllDescriptions(req.app.locals.db, req.body.cityId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** months ****************************//
const getEntryMonths = function (req, resp) {
  transactions.findAllEntryMonths(req.app.locals.db, req.body.cityId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getTransMonths = function (req, resp) {
  transactions.findAllTransMonths(req.app.locals.db, req.body.cityId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
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
  getActiveCategories: getActiveCategories,
  getDescriptions: getDescriptions,
  getEntryMonths: getEntryMonths,
  getTransMonths: getTransMonths
};
