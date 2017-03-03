'use strict';

const numeral = require('numeral');
const transactions = require('../api/models/Transactions')();

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Transactions data started...');
    let sql = 'SELECT T.*, A.DESCRIPTION AS FROM_ACCOUNT_NAME, B.DESCRIPTION AS TO_ACCOUNT_NAME, C.MAIN_CATEGORY,';

    sql += ' C.SUB_CATEGORY FROM TRANSACTIONS T, ACCOUNT A, ACCOUNT B, CATEGORY C';
    sql += ' WHERE T.FROM_ACCOUNT_ID = A.ACCOUNT_ID AND T.TO_ACCOUNT_ID = B.ACCOUNT_ID';
    sql += ' AND T.CATEGORY_ID = C.CATEGORY_ID';
    sqlite.each(sql, function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const trans = {
          id: row.TRANS_ID,
          cityId: row.DATA_KEY,
          entryDt: row.ENTRY_DATE,
          entryMonth: row.ENTRY_MONTH,
          category: {id: numeral(row.CATEGORY_ID).value(), name: row.MAIN_CATEGORY + ' ~ ' + row.SUB_CATEGORY},
          description: row.DESCRIPTION,
          amount: numeral(row.AMOUNT).value(),
          transDt: row.TRANS_DATE,
          transMonth: row.TRANS_MONTH,
          seq: row.TRANS_SEQ,
          accounts: {},
          adhoc: row.ADHOC_IND === 'Y' ? true : false,
          adjust: row.ADJUST_IND === 'Y' ? true : false,
          status: row.STATUS === 'P' ? true : false,
          tallied: row.TALLY_IND === 'Y' ? true : false,
          tallyDt: numeral(row.TALLY_DATE).value(),
        };

        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.from = {
            id: numeral(row.FROM_ACCOUNT_ID).value(),
            name: row.FROM_ACCOUNT_NAME,
            billId: numeral(row.FROM_BILL_ID).value() || 0,
            balanceBf: numeral(row.FROM_BALANCE_BF).value(),
            balanceAf: numeral(row.FROM_BALANCE_AF).value(),
          };
        } else {
          trans.accounts.from = {id: 0, billId: 0, balanceBf: 0, balanceAf: 0};
        }
        if(row.FROM_ACCOUNT_ID) {
          trans.accounts.to = {
            id: numeral(row.TO_ACCOUNT_ID).value(),
            name: row.TO_ACCOUNT_NAME,
            billId: numeral(row.TO_BILL_ID).value() || 0,
            balanceBf: numeral(row.TO_BALANCE_BF).value(),
            balanceAf: numeral(row.TO_BALANCE_AF).value(),
          };
        } else {
          trans.accounts.to = {id: 0, billId: 0, balanceBf: 0, balanceAf: 0};
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
