'use strict';

const moment = require('moment');
const numeral = require('numeral');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const fmt = require('../config/formats');

numeral.defaultFormat('0');
numeral.nullFormat('');

const migrate = function (sqlite, mongo, log, next) {
  sqlite.serialize(function () {
    let count = 0;

    log.info('Accounts data started...');
    let sql = 'SELECT A.*, B.BILL_DT AS LAST_BILL_DT, B.DUE_DT AS LAST_DUE_DT, B.BILL_AMT AS LAST_BILL_AMT,';

    sql += ' C.BILL_DT AS OPEN_BILL_DT, C.DUE_DT AS OPEN_DUE_DT, C.BILL_AMT AS OPEN_BILL_AMT';
    sql += ' FROM ACCOUNT A LEFT OUTER JOIN BILL B ON A.LAST_BILL_ID = B.BILL_ID ';
    sql += ' LEFT OUTER JOIN BILL C ON A.OPEN_BILL_ID = C.BILL_ID';
    sqlite.each(sql, function (err, row) {
      if(err) {
        log.error(err);
      } else {
        const acct = {
          id: row.ACCOUNT_ID,
          cityId: row.DATA_KEY,
          name: row.DESCRIPTION,
          balance: numeral(numeral(row.BALANCE_AMT).format('0.00')).value(),
          cash: row.TYPE === 'C',
          active: row.STATUS === 'A',
          billed: row.BILL_OPTION === 'Y',
          icon: row.IMAGE_CODE,
          color: row.BG_COLOR,
          seq: row.DISPLAY_ORDER,
          tallyBalance: numeral(numeral(row.TALLY_BALANCE).format('0.00')).value() || 0,
          tallyDt: moment(numeral(row.TALLY_DATE).value()).format(fmt.YYYYMMDDHHmmss) || 0,
          closingDay: numeral(row.CLOSING_DAY).value() || 0,
          dueDay: numeral(row.DUE_DAY).value() || 0,
          bills: null
        };

        if(acct.billed) {
          acct.bills = {
            last: {
              id: numeral(row.LAST_BILL_ID).value() || 0,
              billDt: moment(numeral(row.LAST_BILL_DT).value()).format(fmt.YYYYMMDD) || 0,
              dueDt: moment(numeral(row.LAST_DUE_DT).value()).format(fmt.YYYYMMDD) || 0,
              amount: numeral(numeral(row.LAST_BILL_AMT).format('0.00')).value() || 0
            },
            open: {
              id: numeral(row.OPEN_BILL_ID).value() || 0,
              billDt: moment(numeral(row.OPEN_BILL_DT).value()).format(fmt.YYYYMMDD) || 0,
              dueDt: moment(numeral(row.OPEN_DUE_DT).value()).format(fmt.YYYYMMDD) || 0,
              amount: numeral(numeral(row.OPEN_BILL_AMT).format('0.00')).value() || 0
            }
          };
          acct.bills.last.name = bills.getName(acct, acct.bills.last);
          acct.bills.open.name = bills.getName(acct, acct.bills.open);
        }

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
