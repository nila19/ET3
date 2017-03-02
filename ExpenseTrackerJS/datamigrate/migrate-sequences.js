'use strict';

const async = require('async');
const accounts = require('../api/models/Accounts')();
const bills = require('../api/models/Bills')();
const cities = require('../api/models/Cities')();
const categories = require('../api/models/Categories')();
const tallyhistories = require('../api/models/TallyHistories')();
const transactions = require('../api/models/Transactions')();
const sequences = require('../api/models/Sequences')();
let param = null;

const setAccountsSeq = function (cityId, next) {
  accounts.findOne(param.db, {cityId: cityId}, {sort: {acctId: -1}}).then((doc) => {
    sequences.insert(param.db, {seqId: 'accounts', cityId: cityId, seq: doc.acctId + 1}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.info('Error @ setAccountsSeq sequences.insert. - ' + cityId + ' : ' + doc.acctId);
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
  bills.findOne(param.db, {cityId: cityId}, {sort: {billId: -1}}).then((doc) => {
    const doc1 = (doc && doc.billId) ? doc : {billId: 0};

    sequences.insert(param.db, {seqId: 'bills', cityId: cityId, seq: (doc1.billId + 1)}).then(() => {
      return next(null, cityId);
    }).catch((err) => {
      param.log.info('Error @ setBillsSeq sequences.insert. - ' + cityId + ' : ' + doc1.billId);
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
  categories.findOne(param.db, {cityId: cityId}, {sort: {catId: -1}}).then((doc) => {
    sequences.insert(param.db, {seqId: 'categories', cityId: cityId, seq: doc.catId + 1}).then(() => {
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
  tallyhistories.findOne(param.db, {cityId: cityId}, {sort: {tallyId: -1}}).then((doc) => {
    const doc1 = (doc && doc.tallyId) ? doc : {tallyId: 0};

    sequences.insert(param.db, {seqId: 'tallyhistories', cityId: cityId, seq: (doc1.tallyId + 1)}).then(() => {
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
  transactions.findOne(param.db, {cityId: cityId}, {sort: {transId: -1}}).then((doc) => {
    sequences.insert(param.db, {seqId: 'transactions', cityId: cityId, seq: doc.transId + 1}).then(() => {
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
        return nxt(null, doc.cityId);
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
