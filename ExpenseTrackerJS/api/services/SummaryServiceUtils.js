'use strict';

const moment = require('moment');
const number = require('numeral');
const async = require('async');
const categories = require('../models/Categories');
const transactions = require('../models/Transactions');

// utility methods to generate appropriate json..
const getMonth = function (doc) {
  return {
    id: doc,
    aggregate: false,
    name: moment(doc).format('MMM-YY'),
    seq: number(moment(doc).format('YYYYMM')).value(),
    year: number(moment(doc).format('YYYY')).value()
  };
};
const getYear = function (doc) {
  return {
    id: doc,
    aggregate: true,
    name: moment(doc).format('YYYY'),
    seq: number(moment(doc).format('YYYYMM')).value() + 1,
    year: number(moment(doc).format('YYYY')).value()
  };
};

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
    buildTransMonths(docs, function bb(err, months) {
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

// step 2.0 - build the months array structure.
let docs = null;
const buildTransMonths = function (docs1, next) {
  docs = docs1;
  async.waterfall([buildMonths, addCurrentMonth, addCurrentYear, sortMonths], function cb(err, months) {
    if(err) {
      param.log.error(err);
      return next(err);
    }
    return next(null, months);
  });
};

// step 2.1 - build the initial months list.
const buildMonths = function (next) {
  const months = [];

  docs.forEach(function ea(doc) {
    months.push(getMonth(doc));
  });
  return next(null, months);
};

// step 2.2 - check if current month is in the list, if not add it.
const addCurrentMonth = function (next, months) {
  const currMonth = getMonth(moment().valueOf());
  let currMonthPresent = false;

  months.forEach(function ea(month) {
    if(month.seq === currMonth.seq) {
      currMonthPresent = true;
    }
  });
  if(!currMonthPresent) {
    months.push(currMonth);
  }
  return next(null, months);
};

// step 2.3 - extract all years from the months list & add them to the list..
const addCurrentYear = function (next, months) {
  const years = {};

  months.forEach(function ea(month) {
    years[month.year] = moment().year(month.year).month(11).date(31).valueOf();
  });
  for (const year in years) {
    if (years.hasOwnProperty(year)) {
      months.push(getYear(years.year));
    }
  }
  return next(null, months);
};

// step 2.4 - sort the months list based on the 'seq' in reverse.
const sortMonths = function (next, months) {
  months.sort(function sr(aa, bb) {
    return (aa.seq > bb.seq) ? -1 : ((bb.seq > aa.seq) ? 1 : 0);
  });
  return next(null, months);
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
  async.parallel([getCategories, getTransMonths, getTransactions, getFcTransactions], function cc(err, results) {
    // result has arrays of results from previous methods..
    if(err) {
      param.log.error(err);
      return next(err);
    }
    return next(null, results);
  });
};

// utility function
const getMonthIndex = function (months, date) {
  const mon = getMonth(date);

  months.forEach(function aa(month, idx) {
    if(month.seq === mon.seq) {
      return idx;
    }
  });
  return -1;
};

module.exports = {
  getDataFromDB: getDataFromDB,
  getMonthIndex: getMonthIndex
};
