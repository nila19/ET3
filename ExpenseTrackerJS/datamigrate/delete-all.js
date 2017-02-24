'use strict';

const accounts = require('../api/models/Accounts')();
const bills = require('../api/models/Bills')();
const categories = require('../api/models/Categories')();
const cities = require('../api/models/Cities')();
const tallies = require('../api/models/TallyHistories')();
const transactions = require('../api/models/Transactions')();
const wait = 2000;

const deleteAll = function (mongo, log, next) {
  log.info('Delete all data started...');
  accounts.removeAll(mongo);
  bills.removeAll(mongo);
  categories.removeAll(mongo);
  cities.removeAll(mongo);
  tallies.removeAll(mongo);
  transactions.removeAll(mongo);

  setTimeout(function f2() {
    return next();
  }, wait);
};

module.exports = function exp(flag, mongo, log, next) {
  if(flag) {
    return deleteAll(mongo, log, function cb() {
      return next();
    });
  } else {
    return next();
  }
};
