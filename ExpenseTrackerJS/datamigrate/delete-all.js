'use strict';

const async = require('async');
const accounts = require('../api/models/Accounts')();
const bills = require('../api/models/Bills')();
const categories = require('../api/models/Categories')();
const cities = require('../api/models/Cities')();
const tallies = require('../api/models/TallyHistories')();
const transactions = require('../api/models/Transactions')();
const sequences = require('../api/models/Sequences')();
let param = null;

const deleteAccounts = function (next) {
  accounts.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteBills = function (next) {
  bills.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteCategories = function (next) {
  categories.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteCities = function (next) {
  cities.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteTallies = function (next) {
  tallies.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteTransactions = function (next) {
  transactions.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};
const deleteSequences = function (next) {
  sequences.removeAll(param.mongo).then(() => {
    next();
  }).catch((err) => {
    param.log.error(err);
    next(err);
  });
};

const deleteAll = function (next) {
  param.log.info('Delete all data started...');
  async.waterfall([deleteAccounts, deleteBills, deleteCategories, deleteCities,
    deleteTallies, deleteTransactions, deleteSequences], function bb(err) {
    if(err) {
      param.log.error(err);
      return next(err);
    }
    param.log.info('Delete all data completed...');
    return next(null);
  });
};

module.exports = function exp(db, log, next) {
  param = {
    mongo: db,
    log: log
  };
  deleteAll(function cb() {
    return next();
  });
};
