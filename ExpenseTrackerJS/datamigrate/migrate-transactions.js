'use strict';

const number = require('numeral');
const transactions = require('../api/models/Transactions')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Transactions data started...');
    sqlite.each('SELECT * FROM TRANSACTIONS', function (err, row) {
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
          adhoc: row.ADHOC_IND === 'Y' ? true : false,
          adjust: row.ADJUST_IND === 'Y' ? true : false,
          status: row.STATUS === 'P' ? true : false,
          tallied: row.TALLY_IND === 'Y' ? true : false,
          tallyDt: number(row.TALLY_DATE).value(),
        };

        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.from = {
            acctId: number(row.FROM_ACCOUNT_ID).value(),
            billId: number(row.FROM_BILL_ID).value(),
            balanceBf: number(row.FROM_BALANCE_BF).value(),
            balanceAf: number(row.FROM_BALANCE_AF).value(),
          };
        } else {
          trans.accounts.from = {
            acctId: 0,
            billId: null,
            balanceBf: 0,
            balanceAf: 0,
          };
        }
        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.to = {
            acctId: number(row.TO_ACCOUNT_ID).value(),
            billId: number(row.TO_BILL_ID).value(),
            balanceBf: number(row.TO_BALANCE_BF).value(),
            balanceAf: number(row.TO_BALANCE_AF).value(),
          };
        } else {
          trans.accounts.to = {
            acctId: 0,
            billId: null,
            balanceBf: 0,
            balanceAf: 0,
          };
        }

        transactions.insert(mongo, trans);
        count += 1;
      }
    }, function () {
      log.info('Transactions data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
