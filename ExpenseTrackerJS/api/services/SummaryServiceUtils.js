'use strict';

const async = require('async');
const categories = require('../models/Categories')();
const transactions = require('../models/Transactions')();
const monthUtils = require('../utils/month-utils');

//* *************************************************//
// step 1 : fetch categories from DB
const getCategories = function (next) {
  categories.findForCity(param.db, param.cityId).then((docs) => {
    return next(null, docs);
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};

// step 2 - fetch trans months from DB & build the months array structure.
const getTransMonths = function (next) {
  transactions.findAllTransMonths(param.db, param.cityId).then((docs) => {
    monthUtils.buildMonthsList(docs, param.log, function (err, months) {
      if(err) {
        param.log.error(err);
        return next(err);
      }
      return next(null, months);
    });
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};

// step 3 - fetch transactions from DB
const getTransactions = function (next) {
  transactions.findForMonthlySummary(param.db, param.cityId, param.regular, param.adhoc).then((docs) => {
    return next(null, docs);
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};

// step 4 - fetch forecast transactions from DB
const getFcTransactions = function (next) {
  transactions.findForForecast(param.db, param.cityId).then((docs) => {
    return next(null, docs);
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};

// step - 0 : initial method to fetch all data from DB..
let param = null;
const getDataFromDB = function (params, next) {
  param = params;
  async.parallel([getCategories, getTransMonths, getTransactions, getFcTransactions], function (err, results) {
    // result has arrays of results from previous methods..
    if(err) {
      param.log.error(err);
      return next(err);
    }
    const data = {
      categories: results[0],
      transMonths: results[1],
      transactions: results[2],
      fcTransactions: results[3]
    };

    return next(null, data);
  });
};

// utility function
const getMonthIndex = function (months, date) {
  const month = monthUtils.getMonth(date);
  let pos = -1;
  let i = 0;

  while (i < months.length && pos < 0) {
    if(month.seq === months[i].seq) {
      pos = i;
    }
    i += 1;
  }
  return pos;
};

module.exports = {
  getDataFromDB: getDataFromDB,
  getMonthIndex: getMonthIndex
};
