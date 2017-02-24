/* eslint no-magic-numbers: "off" */

const dt = require('moment');

const log = require('../api/utils/logger');
const trans = require('../api/models/Transactions')();

const queryAll = function (mongo, log, next) {
  log.info('Query transactions started...');
  const filter = {acctId: 60, adjust: 'Y', entryMonth: 1467349200000, entryYear: true, description: 'paym'};
  // bills.find(mongo, {acctId: 81, 'payments.amount': {$gt: 500}}).then((docs) => {

  trans.findForSearch(mongo, 20140301, filter).then((docs) => {
    log.info('************** TEST **************...');
    docs.forEach(function fe(row) {
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

require('../api/config/mongodb-config').connect(log, function cb(mongo) {
  queryAll(mongo, log, function next() {
    mongo.close();
  });
});
