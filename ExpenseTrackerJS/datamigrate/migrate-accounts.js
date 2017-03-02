'use strict';

const number = require('numeral');
// const ts = require('moment');

const accounts = require('../api/models/Accounts')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function f1() {
    let count = 0;

    log.info('Accounts data started...');
    sqlite.each('SELECT * FROM ACCOUNT', function fn(err, row) {
      if(err) {
        log.error(err);
      } else {
        const acct = {
          acctId: row.ACCOUNT_ID,
          cityId: row.DATA_KEY,
          description: row.DESCRIPTION,
          balance: number(row.BALANCE_AMT).value(),
          type: row.TYPE,
          status: row.STATUS,
          billed: row.BILL_OPTION === 'Y' ? true : false,
          icon: row.IMAGE_CODE,
          color: row.BG_COLOR,
          seq: row.DISPLAY_ORDER,
          tallyBalance: number(row.TALLY_BALANCE).value(),
          tallyDt: number(row.TALLY_DATE).value(),
          closingDay: number(row.CLOSING_DAY).value(),
          dueDay: number(row.DUE_DAY).value(),
          lastBillId: number(row.LAST_BILL_ID).value(),
          openBillId: number(row.OPEN_BILL_ID).value()
        };

        accounts.insert(mongo, acct);
        count += 1;
      }
    }, function done() {
      log.info('Accounts data over... : ' + count);
      return next();
    });
  });
};

module.exports = function exp(sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function cb() {
    return next();
  });
};
