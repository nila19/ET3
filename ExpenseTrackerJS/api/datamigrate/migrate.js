
const async = require('async');
const sqlite3 = require('sqlite3').verbose();
const mongoconfig = require('../config/mongodb-config');

const config = require('../config/config');
const log = require('../utils/logger');
const accounts = require('./migrate-accounts');
const bills = require('./migrate-bills');
const categories = require('./migrate-categories');
const cities = require('./migrate-cities');
const tallies = require('./migrate-tallyhistories');
const transactions = require('./migrate-transactions');
const sequences = require('./migrate-sequences');
const deleteAll = require('./delete-all');

const sqlite = new sqlite3.Database(config.sqlite, sqlite3.OPEN_READONLY);
let param = null;

const account = function (next) {
  accounts(param.sqlite, param.mongo, param.log, function () {
    log.info('Accounts completed...');
    next();
  });
};

const bill = function (next) {
  bills(param.sqlite, param.mongo, param.log, function () {
    log.info('Bills completed...');
    next();
  });
};

const category = function (next) {
  categories(param.sqlite, param.mongo, param.log, function () {
    log.info('Categories completed...');
    next();
  });
};

const city = function (next) {
  cities(param.sqlite, param.mongo, param.log, function () {
    log.info('Cities completed...');
    next();
  });
};

const tally = function (next) {
  tallies(param.sqlite, param.mongo, param.log, function () {
    log.info('TallyHistory completed...');
    next();
  });
};

const transaction = function (next) {
  transactions(param.sqlite, param.mongo, param.log, function () {
    log.info('Transactions completed...');
    next();
  });
};

const sequence = function (next) {
  sequences(param.mongo, param.log, function () {
    log.info('Sequence completed...');
    next();
  });
};

const clear = function (next) {
  deleteAll(param.mongo, param.log, function () {
    log.info('Delete completed...');
    next();
  });
};

const main = function (next) {
  mongoconfig.connect(log, function (mongo) {
    param = {
      log: log,
      mongo: mongo,
      sqlite: sqlite
    };

    log.info('******* Migration activities started...!!!!!');
    async.waterfall([clear, account, bill, category, city, tally,
      transaction, sequence], function (err) {
      if(err) {
        param.log.error(err);
        return next(err);
      }
      sqlite.close();
      mongo.close();
      return next();
    });
  });
};

main(function (err) {
  if(err) {
    log.error(err);
  }
  log.info('***** Migration activities completed...!!!!!');
});
