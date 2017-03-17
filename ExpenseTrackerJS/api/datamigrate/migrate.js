
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
let parms = null;

const main = function () {
  mongoconfig.connect(log, function (mongo) {
    parms = {
      log: log,
      mongo: mongo,
      sqlite: sqlite
    };

    log.info('******* Migration activities started...!!!!!');
    async.waterfall([clear, account, bill, category, city, tally,
      transaction, sequence], function (err) {
      if(err) {
        parms.log.error(err);
      }
      sqlite.close();
      mongo.close();
      log.info('***** Migration activities completed...!!!!!');
    });
  });
};

const clear = function (next) {
  deleteAll(parms.mongo, parms.log, next);
};

const account = function (next) {
  accounts(parms.sqlite, parms.mongo, parms.log, next);
};

const bill = function (next) {
  bills(parms.sqlite, parms.mongo, parms.log, next);
};

const category = function (next) {
  categories(parms.sqlite, parms.mongo, parms.log, next);
};

const city = function (next) {
  cities(parms.sqlite, parms.mongo, parms.log, next);
};

const tally = function (next) {
  tallies(parms.sqlite, parms.mongo, parms.log, next);
};

const transaction = function (next) {
  transactions(parms.sqlite, parms.mongo, parms.log, next);
};

const sequence = function (next) {
  sequences(parms.mongo, parms.log, next);
};

main();
