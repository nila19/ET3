'use strict';

const numeral = require('numeral');
const accounts = require('../models/Accounts')();
const cities = require('../models/Cities')();
const categories = require('../models/Categories')();
const transactions = require('../models/Transactions')();
const monthUtils = require('../utils/month-utils');
const error = 1000;

const canConnect = function (req, resp) {
  accounts.findById(req.app.locals.db, 0).then(() => {
    return resp.json({code: 0, data: true});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error, data: false});
  });
};

// **************************** city ****************************//
const getAllCities = function (req, resp) {
  cities.findAllCities(req.app.locals.db).then((docs) => {
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
  cities.findById(req.app.locals.db, cityId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** account ****************************//
const getActiveAccounts = function (req, resp) {
  accounts.findForCityActive(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getInactiveAccounts = function (req, resp) {
  accounts.findForCityInactive(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** categories ****************************//
const getAllCategories = function (req, resp) {
  categories.findForCity(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getCategories = function (req, resp) {
  categories.findForCityActive(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
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
    return resp.json({code: error});
  });
};

// **************************** months ****************************//
const getEntryMonths = function (req, resp) {
  transactions.findAllEntryMonths(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    monthUtils.buildMonthsList(docs, req.app.locals.log, function (err, dates) {
      if(err) {
        req.app.locals.log.error(err);
        return resp.json({code: error});
      } else {
        return resp.json({code: 0, data: dates});
      }
    });
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getTransMonths = function (req, resp) {
  transactions.findAllTransMonths(req.app.locals.db, numeral(req.query.cityId).value()).then((docs) => {
    monthUtils.buildMonthsList(docs, req.app.locals.log, function (err, dates) {
      if(err) {
        req.app.locals.log.error(err);
        return resp.json({code: error});
      } else {
        return resp.json({code: 0, data: dates});
      }
    });
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
  getCategories: getCategories,
  getDescriptions: getDescriptions,
  getEntryMonths: getEntryMonths,
  getTransMonths: getTransMonths
};
