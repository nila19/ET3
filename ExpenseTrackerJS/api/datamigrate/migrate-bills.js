'use strict';

const moment = require('moment');
const numeral = require('numeral');
const bills = require('../models/Bills')();
const fmt = require('../config/formats');

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
          createdDt: moment(numeral(row.CREATED_DT).value()).format(fmt.YYYYMMDDHHmmss),
          billDt: moment(numeral(row.BILL_DT).value()).format(fmt.YYYYMMDD),
          dueDt: moment(numeral(row.DUE_DT).value()).format(fmt.YYYYMMDD),
          closed: row.STATUS === 'C',
          amount: numeral(numeral(row.BILL_AMT).format('0.00')).value(),
          balance: numeral(numeral(row.BILL_BALANCE).format('0.00')).value(),
          payments: []
        };

        bill.name = bills.getName(bill.account, bill);
        if(row.BILL_PAID_DT || row.PAY_TRAN_ID) {
          bill.payments.push({
            id: row.PAY_TRAN_ID | 0,
            transDt: moment(numeral(row.BILL_PAID_DT).value()).format(fmt.YYYYMMDD),
            amount: numeral(numeral(row.BILL_AMT).format('0.00')).value()
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
