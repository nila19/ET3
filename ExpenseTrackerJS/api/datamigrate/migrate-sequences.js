'use strict';

const async = require('async');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const cities = require('../models/Cities')();
const categories = require('../models/Categories')();
const tallyhistories = require('../models/TallyHistories')();
const transactions = require('../models/Transactions')();
const sequences = require('../models/Sequences')();
let param = null;

const setAccountsSeq = function (cityId, next) {
  accounts.findOne(param.db, {cityId: cityId}, {sort: {id: -1}}).then((doc) => {
    sequences.insert(param.db, {table: 'accounts', cityId: cityId, seq: doc.id + 1}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.info('Error @ setAccountsSeq sequences.insert. - ' + cityId + ' : ' + doc.id);
      param.log.error(err);
      return next(err);
    });
  }).catch((err) => {
    param.log.info('Error @ setAccountsSeq accounts.findOne... - ' + cityId);
    param.log.error(err);
    return next(err);
  });
};
const setBillsSeq = function (cityId, next) {
  bills.findOne(param.db, {cityId: cityId}, {sort: {id: -1}}).then((doc) => {
    const doc1 = (doc && doc.id) ? doc : {id: 0};

    sequences.insert(param.db, {table: 'bills', cityId: cityId, seq: (doc1.id + 1)}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.info('Error @ setBillsSeq sequences.insert. - ' + cityId + ' : ' + doc1.id);
      param.log.error(err);
      return next(err);
    });
  }).catch((err) => {
    param.log.info('Error @ setBillsSeq bills.findOne... - ' + cityId);
    param.log.error(err);
    return next(err);
  });
};
const setCategoriesSeq = function (cityId, next) {
  categories.findOne(param.db, {cityId: cityId}, {sort: {id: -1}}).then((doc) => {
    sequences.insert(param.db, {table: 'categories', cityId: cityId, seq: doc.id + 1}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.error(err);
      return next(err);
    });
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};
const setTallyHistoriesSeq = function (cityId, next) {
  tallyhistories.findOne(param.db, {cityId: cityId}, {sort: {id: -1}}).then((doc) => {
    const doc1 = (doc && doc.id) ? doc : {id: 0};

    sequences.insert(param.db, {table: 'tallyhistories', cityId: cityId, seq: (doc1.id + 1)}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.error(err);
      return next(err);
    });
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};
const setTransactionsSeq = function (cityId, next) {
  transactions.findOne(param.db, {cityId: cityId}, {sort: {id: -1}}).then((doc) => {
    sequences.insert(param.db, {table: 'transactions', cityId: cityId, seq: doc.id + 1}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.error(err);
      return next(err);
    });
  }).catch((err) => {
    param.log.error(err);
    return next(err);
  });
};
// triggers all the migrate process.
const migrate = function (mongo, log, next) {
  param = {
    db: mongo,
    log: log
  };
  let count = 0;

  param.log.info('Sequences data started...');
  cities.findAllCities(param.db).then((docs) => {
    async.each(docs, function (doc, cb) {
      async.waterfall([function (nxt) {
        return nxt(null, doc.id);
      }, setAccountsSeq, setBillsSeq, setCategoriesSeq, setTransactionsSeq,
        setTallyHistoriesSeq], function (err) {
        if(err) {
          param.log.error(err);
          return cb(err);
        }
        count += 1;
        return cb();
      });
    }, function (err) {
      if(err) {
        param.log.error(err);
        return next(err);
      }
      param.log.info('Sequences data over... : ' + count);
      return next();
    });
  }).catch((err) => {
    param.log.info('Error @ cities findAllDesc... ');
    param.log.error(err);
    return next(err);
  });
};

module.exports = function (mongo, log, next) {
  return migrate(mongo, log, function () {
    return next();
  });
};
