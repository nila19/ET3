/* eslint no-magic-numbers: "off" */

const dt = require('moment');
const sugar = require('sugar');

const log = require('../api/utils/logger');
const trans = require('../api/models/Transactions')();
const monthUtils = require('../api/utils/month-utils');

const queryAll = function (mongo, log, next) {
  log.info('Query transactions started...');
  const filter = {acctId: 60, cityId: 20140301, adjust: 'Y', description: 'paym', thinList: true};
  // bills.find(mongo, {acctId: 81, 'payments.amount': {$gt: 500}}).then((docs) => {
  const msg = sugar.String('someone sAid somEThing SOMEWHERE.. also nothing..').capitalize(true, true);

  log.info('msg =' + msg.raw + '::');

  trans.findForSearch(mongo, filter).then((docs) => {
    log.info('************** TEST **************...');
    docs.forEach(function (row) {
      // log.info('DATES :: ' + dt(row).format());
      log.info(JSON.stringify(row) + ' :: ' + dt(row.entryMonth).format());
    });
    log.info('************** DONE TEST **************...');
    return next();
  }).catch((err) => {
    log.error(err);
    return next();
  });
};

const getTransMonths = function (mongo, log, next) {
  trans.findAllTransMonths(mongo, 20140301).then((docs) => {
    monthUtils.buildMonthsList(docs, log, function (err, dates) {
      if(err) {
        log.error(err);
      } else {
        log.info('************** TEST **************...');
        dates.forEach(function (row) {
          log.info(JSON.stringify(row));
        });
        log.info('************** DONE TEST **************...');
      }
      return next(err);
    });
  }).catch((err) => {
    log.error(err);
  });
};

// debugger;

require('../api/config/mongodb-config').connect(log, function (mongo) {
  // queryAll(mongo, log, function (err) {
  // getTransMonths(mongo, log, function (err) {
  //   log.error(err);
  //   mongo.close();
  // });
  mongo.close();
  const tally2 = dt().subtract(4, 'hours');

  log.info(tally2.valueOf() + ' - ' + dt().isSame(tally2, 'day'));
});
