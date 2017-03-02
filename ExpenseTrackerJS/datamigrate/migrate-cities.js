'use strict';

const number = require('numeral');
const cities = require('../api/models/Cities')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Cities data started...');
    sqlite.each('SELECT * FROM DATAKEY', function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const city = {
          cityId: row.DATA_KEY,
          description: row.DESCRIPTION,
          status: row.STATUS,
          default: row.DEFAULT_IND === 'Y' ? true : false,
          currency: row.CURRENCY,
          startDt: number(row.START_DT).value(),
          endDt: number(row.END_DT).value(),
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
