'use strict';

const moment = require('moment');
const numeral = require('numeral');
const async = require('async');
let dates = null;

// utility methods to generate appropriate json..
const getMonth = function (date) {
  return {
    id: date,
    aggregate: false,
    name: moment(date).format('MMM-YY'),
    seq: numeral(moment(date).format('YYYYMM')).value(),
    year: numeral(moment(date).format('YYYY')).value()
  };
};
const getYear = function (date) {
  return {
    id: date,
    aggregate: true,
    name: moment(date).format('YYYY'),
    seq: numeral(moment(date).format('YYYYMM')).value() + 1,
    year: numeral(moment(date).format('YYYY')).value()
  };
};
// step 2.0 - build the months array structure.
const buildMonthsList = function (dates1, log, next) {
  dates = dates1;
  async.waterfall([buildMonths, addCurrentMonth, addYears, sortMonths], function (err, months) {
    if(err) {
      log.error(err);
      return next(err);
    }
    return next(null, months);
  });
};

// step 2.1 - build the initial months list.
const buildMonths = function (next) {
  const months = [];

  dates.forEach(function (date) {
    months.push(getMonth(date));
  });
  return next(null, months);
};

// step 2.2 - check if current month is in the list, if not add it.
const addCurrentMonth = function (months, next) {
  const currMonth = getMonth(moment().valueOf());
  let currMonthPresent = false;

  months.forEach(function (month) {
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
const addYears = function (months, next) {
  const years = {};

  months.forEach(function (month) {
    years[month.year] = moment().year(month.year).month(11).date(31).valueOf();
  });
  for (const year in years) {
    if (years.hasOwnProperty(year)) {
      months.push(getYear(years[year]));
    }
  }
  return next(null, months);
};

// step 2.4 - sort the months list based on the 'seq' in reverse.
const sortMonths = function (months, next) {
  months.sort(function (aa, bb) {
    return (aa.seq > bb.seq) ? -1 : ((bb.seq > aa.seq) ? 1 : 0);
  });
  return next(null, months);
};

module.exports = {
  buildMonthsList: buildMonthsList,
  getMonth: getMonth,
  getYear: getYear
};
