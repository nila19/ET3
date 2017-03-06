'use strict';

const moment = require('moment');
const numeral = require('numeral');
const bills = require('../api/models/Bills')();

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Bills data started...');
    sqlite.each('SELECT B.*, A.DESCRIPTION FROM BILL B, ACCOUNT A WHERE B.ACCOUNT_ID = A.ACCOUNT_ID',
    function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const bill = {
          id: row.BILL_ID,
          cityId: row.DATA_KEY,
          account: {id: row.ACCOUNT_ID, name: row.DESCRIPTION},
          createdDt: numeral(row.CREATED_DT).value(),
          billDt: numeral(row.BILL_DT).value(),
          dueDt: numeral(row.DUE_DT).value(),
          closed: row.STATUS === 'C',
          amount: numeral(row.BILL_AMT).value(),
          balance: numeral(row.BILL_BALANCE).value(),
          payments: []
        };
        const billDt = moment(numeral(row.BILL_DT).value()).format('YYYY-MM-DD');

        bill.name = row.DESCRIPTION + ' : ' + billDt + ' #' + row.BILL_ID;

        if(row.BILL_PAID_DT || row.PAY_TRAN_ID) {
          bill.payments.push({
            id: row.PAY_TRAN_ID | 0,
            transDt: numeral(row.BILL_PAID_DT).value(),
            amount: numeral(row.BILL_AMT).value()
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
