'use strict';

const number = require('numeral');

const tallies = require('../api/models/TallyHistories')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function f1() {
    let count = 0;

    log.info('Tally Histories data started...');
    sqlite.each('SELECT * FROM TALLY_HISTORY', function fn(err, row) {
      if(err) {
        log.error(err);
      } else {
        const tally = {
          tallyId: row.TALLY_SEQ,
          acctId: row.ACCOUNT_ID,
          cityId: row.DATA_KEY,
          tallyDt: number(row.TALLY_DATE).value(),
          balance: number(row.TALLY_BALANCE).value(),
        };

        tallies.insert(mongo, tally);
        count += 1;
      }
    }, function done() {
      log.info('Tally Histories data over... : ' + count);
      return next();
    });
  });
};

module.exports = function exp(sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function cb() {
    return next();
  });
};
