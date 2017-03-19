'use strict';

const moment = require('moment');
const numeral = require('numeral');
const cities = require('../models/Cities')();
const fmt = require('../config/formats');

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Cities data started...');
    sqlite.each('SELECT * FROM DATAKEY', function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const city = {
          id: row.DATA_KEY,
          name: row.DESCRIPTION,
          active: row.STATUS === 'A',
          default: row.DEFAULT_IND === 'Y',
          currency: row.CURRENCY,
          startDt: moment(numeral(row.START_DT).value(), 'YYYYMMDD').format(fmt.YYYYMMDD),
          endDt: moment(numeral(row.END_DT).value(), 'YYYYMMDD').format(fmt.YYYYMMDD),
        };

        cities.insert(mongo, city);
        count += 1;
      }
    }, function () {
      log.info('Cities data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
