'use strict';

const moment = require('moment');
const numeral = require('numeral');
const tallies = require('../models/TallyHistories')();
const fmt = require('../config/formats');

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Tally Histories data started...');
    sqlite.each('SELECT A.*, B.DESCRIPTION FROM TALLY_HISTORY A, ACCOUNT B WHERE A.ACCOUNT_ID = B.ACCOUNT_ID',
    function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const tally = {
          id: row.TALLY_SEQ,
          account: {id: row.ACCOUNT_ID, name: row.DESCRIPTION},
          cityId: row.DATA_KEY,
          tallyDt: moment(numeral(row.TALLY_DATE).value()).format(fmt.YYYYMMDDHHmmss),
          balance: numeral(numeral(row.TALLY_BALANCE).format('0.00')).value(),
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
