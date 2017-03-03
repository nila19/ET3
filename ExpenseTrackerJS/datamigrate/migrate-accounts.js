'use strict';

const numeral = require('numeral');
// const ts = require('moment');

const accounts = require('../api/models/Accounts')();

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Accounts data started...');
    sqlite.each('SELECT * FROM ACCOUNT', function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const acct = {
          id: row.ACCOUNT_ID,
          cityId: row.DATA_KEY,
          name: row.DESCRIPTION,
          balance: numeral(row.BALANCE_AMT).value(),
          cash: row.TYPE === 'C',
          active: row.STATUS === 'A',
          billed: row.BILL_OPTION === 'Y',
          icon: row.IMAGE_CODE,
          color: row.BG_COLOR,
          seq: row.DISPLAY_ORDER,
          tallyBalance: numeral(row.TALLY_BALANCE).value() || 0,
          tallyDt: numeral(row.TALLY_DATE).value() || 0,
          closingDay: numeral(row.CLOSING_DAY).value() || 0,
          dueDay: numeral(row.DUE_DAY).value() || 0,
          lastBillId: numeral(row.LAST_BILL_ID).value() || 0,
          openBillId: numeral(row.OPEN_BILL_ID).value() || 0
        };

        accounts.insert(mongo, acct);
        count += 1;
      }
    }, function () {
      log.info('Accounts data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
