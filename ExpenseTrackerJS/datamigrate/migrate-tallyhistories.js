'use strict';

const number = require('numeral');

const tallies = require('../api/models/TallyHistories')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Tally Histories data started...');
    sqlite.each('SELECT * FROM TALLY_HISTORY', function (err, row) {
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
    }, function () {
      log.info('Tally Histories data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
