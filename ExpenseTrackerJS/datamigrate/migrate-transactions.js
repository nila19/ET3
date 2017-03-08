'use strict';

const moment = require('moment');
const numeral = require('numeral');
const transactions = require('../api/models/Transactions')();

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Transactions data started...');
    let sql = 'SELECT T.*, A.DESCRIPTION AS FROM_ACCOUNT_NAME, B.DESCRIPTION AS TO_ACCOUNT_NAME, C.MAIN_CATEGORY,';

    sql += ' C.SUB_CATEGORY, D.BILL_DT FROM ACCOUNT A, ACCOUNT B, CATEGORY C, TRANSACTIONS T LEFT OUTER JOIN BILL D';
    sql += ' ON T.FROM_BILL_ID = D.BILL_ID WHERE T.FROM_ACCOUNT_ID = A.ACCOUNT_ID';
    sql += ' AND T.TO_ACCOUNT_ID = B.ACCOUNT_ID AND T.CATEGORY_ID = C.CATEGORY_ID';
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
          amount: numeral(numeral(row.AMOUNT).format('0.00')).value(),
          transDt: row.TRANS_DATE,
          transMonth: row.TRANS_MONTH,
          seq: row.TRANS_SEQ,
          accounts: {},
          bill: null,
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
            balanceBf: numeral(numeral(row.FROM_BALANCE_BF).format('0.00')).value(),
            balanceAf: numeral(numeral(row.FROM_BALANCE_AF).format('0.00')).value(),
          };
        } else {
          trans.accounts.from = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
        }
        if(row.TO_ACCOUNT_ID) {
          trans.accounts.to = {
            id: numeral(row.TO_ACCOUNT_ID).value(),
            name: row.TO_ACCOUNT_NAME,
            balanceBf: numeral(numeral(row.TO_BALANCE_BF).format('0.00')).value(),
            balanceAf: numeral(numeral(row.TO_BALANCE_AF).format('0.00')).value(),
          };
        } else {
          trans.accounts.to = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
        }
        if(row.FROM_BILL_ID) {
          const billDt = moment(numeral(row.BILL_DT).value()).format('YYYY-MM-DD');
          const billname = row.FROM_ACCOUNT_NAME + ' : ' + billDt + ' #' + row.FROM_BILL_ID;

          trans.bill = {
            id: numeral(row.FROM_BILL_ID).value(),
            name: billname,
            account: {id: trans.accounts.from.id, name: trans.accounts.from.name}
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
