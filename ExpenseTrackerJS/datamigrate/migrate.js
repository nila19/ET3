const sqlite3 = require('sqlite3').verbose();

const config = require('../api/config/config');
const log = require('../api/utils/logger');
const accounts = require('./migrate-accounts');
const bills = require('./migrate-bills');
const categories = require('./migrate-categories');
const cities = require('./migrate-cities');
const tallies = require('./migrate-tallyhistories');
const transactions = require('./migrate-transactions');
const deleteAll = require('./delete-all');

const sqlite = new sqlite3.Database(config.sqlite, sqlite3.OPEN_READONLY);

const account = function (sqlite, mongo, log, next) {
  accounts(sqlite, mongo, log, function cb() {
    log.info('AccountsMgr completed...');
    next();
  });
};

const bill = function (sqlite, mongo, log, next) {
  bills(sqlite, mongo, log, function cb() {
    log.info('BillsMgr completed...');
    next();
  });
};

const category = function (sqlite, mongo, log, next) {
  categories(sqlite, mongo, log, function cb() {
    log.info('CategoriesMgr completed...');
    next();
  });
};

const city = function (sqlite, mongo, log, next) {
  cities(sqlite, mongo, log, function cb() {
    log.info('CitiesMgr completed...');
    next();
  });
};

const tally = function (sqlite, mongo, log, next) {
  tallies(sqlite, mongo, log, function cb() {
    log.info('TallyHistoryMgr completed...');
    next();
  });
};

const transaction = function (sqlite, mongo, log, next) {
  transactions(sqlite, mongo, log, function cb() {
    log.info('TransactionsMgr completed...');
    next();
  });
};

const clear = function (mongo, log, next) {
  deleteAll(true, mongo, log, function cb() {
    log.info('DeleteAllMgr completed...');
    next();
  });
};

require('../api/config/mongodb-config').connect(log, function cb(mongo) {
  clear(mongo, log, function next() {
    account(sqlite, mongo, log, function next() {
      bill(sqlite, mongo, log, function next() {
        category(sqlite, mongo, log, function next() {
          city(sqlite, mongo, log, function next() {
            tally(sqlite, mongo, log, function next() {
              transaction(sqlite, mongo, log, function next() {
                sqlite.close();
                mongo.close();
              });
            });
          });
        });
      });
    });
  });
});
