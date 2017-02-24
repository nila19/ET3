'use strict';

const number = require('numeral');
// const ts = require('moment');

const transactions = require('../api/models/Transactions')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function f1() {
    let count = 0;

    log.info('Transactions data started...');
    sqlite.each('SELECT * FROM TRANSACTIONS', function fn(err, row) {
      if(err) {
        log.error(err);
      } else {
        const trans = {
          transId: row.TRANS_ID,
          cityId: row.DATA_KEY,
          entryDt: row.ENTRY_DATE,
          entryMonth: row.ENTRY_MONTH,
          catId: number(row.CATEGORY_ID).value(),
          description: row.DESCRIPTION,
          amount: number(row.AMOUNT).value(),
          transDt: row.TRANS_DATE,
          transMonth: row.TRANS_MONTH,
          seq: row.TRANS_SEQ,
          accounts: {},
          adhoc: row.ADHOC_IND,
          adjust: row.ADJUST_IND,
          status: row.STATUS,
          tallied: row.TALLY_IND,
          tallyDt: number(row.TALLY_DATE).value(),
        };

        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.from = {
            acctId: number(row.FROM_ACCOUNT_ID).value(),
            billId: number(row.FROM_BILL_ID).value(),
            balanceBf: number(row.FROM_BALANCE_BF).value(),
            balanceAf: number(row.FROM_BALANCE_AF).value(),
          };
        }
        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.to = {
            acctId: number(row.TO_ACCOUNT_ID).value(),
            billId: number(row.TO_BILL_ID).value(),
            balanceBf: number(row.TO_BALANCE_BF).value(),
            balanceAf: number(row.TO_BALANCE_AF).value(),
          };
        }

        transactions.insert(mongo, trans);
        count += 1;
      }
    }, function done() {
      log.info('Transactions data over... : ' + count);
      return next();
    });
  });
};

module.exports = function exp(sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function cb() {
    return next();
  });
};
