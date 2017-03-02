'use strict';

const number = require('numeral');
// const ts = require('moment');

const bills = require('../api/models/Bills')();

number.defaultFormat('0');
number.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Bills data started...');
    sqlite.each('SELECT * FROM BILL', function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const bill = {
          billId: row.BILL_ID,
          cityId: row.DATA_KEY,
          acctId: row.ACCOUNT_ID,
          createdDt: number(row.CREATED_DT).value(),
          billDt: number(row.BILL_DT).value(),
          dueDt: number(row.DUE_DT).value(),
          status: row.STATUS,
          amount: number(row.BILL_AMT).value(),
          balance: number(row.BILL_BALANCE).value(),
          payments: []
        };

        if(row.BILL_PAID_DT || row.PAY_TRAN_ID) {
          bill.payments.push({
            transId: row.PAY_TRAN_ID | 0,
            transDt: number(row.BILL_PAID_DT).value(),
            amount: number(row.BILL_AMT).value()
          });
        }

        bills.insert(mongo, bill);
        count += 1;
      }
    }, function () {
      log.info('Bills data over... : ' + count);
      return next();
    });
  });
};

module.exports = function (sqlite, mongo, log, next) {
  return migrate(sqlite, mongo, log, function () {
    return next();
  });
};
