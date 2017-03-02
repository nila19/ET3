// TODO Fix this..
/* eslint no-unused-vars: "off" */
'use strict';

const moment = require('moment');
const async = require('async');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions')();
const tallyhistories = require('../models/TallyHistories')();
const sequences = require('../api/models/Sequences')();
const error = 1000;
let parms = null;
let ac = null;

const tallyAccount = function (req, resp, acctId) {
  parms = {
    db: req.app.locals.db,
    log: req.app.locals.log,
    acctId: acctId,
    now: moment().valueOf()
  };

  async.waterfall([fetchAccount, editCity, updateAccount, fetchTallySeq,
    insertTallyHistory, updateTrans], function (err, gridArr) {
    if(err) {
      parms.log.error(err);
      return resp.json({code: error});
    }
    return resp.json({code: 0, msg: 'Tallied successfully.'});
  });
};

const fetchAccount = function (next) {
  accounts.findOne(db, {acctId: parms.acctId}).then((account) => {
    ac = account;
    return next();
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const editCity = function (next) {
  // TODO Implement City editable check..
  return next();
};
const updateAccount = function (next) {
  accounts.update(db, {acctId: ac.acctId}, {$set: {tallyBalance: ac.balance, tallyDt: parms.now}}).then(() => {
    return next();
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const fetchTallySeq = function (next) {
  sequences.getNextSeq(db, {seqId: 'tallyhistories', cityId: ac.cityId}).then((seq) => {
    return next(null, seq);
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const insertTallyHistory = function (seq, next) {
  tallyhistories.insert(db, {tallyId: seq.seq, acctId: ac.acctId, cityId: ac.cityId, tallyDt: parms.now,
    balance: ac.balance}).then((th) => {
      return next();
    }).catch((err) => {
      parms.log.error(err);
      return next(err);
    });
};
const updateTrans = function (next) {
  transactions.findForAcct(db, ac.cityId, ac.acctId).then((trans) => {
    async.each(trans, function (tran, cb) {
      if(!tran.tallied) {
        transactions.update(db, {transId: tran.transId}, {$set: {tallied: true, tallyDt: parms.now}}).then(() => {
          return cb();
        }).catch((err) => {
          parms.log.error(err);
          return cb(err);
        });
      } else {
        return cb();
      }
    }, function (err) {
      if(err) {
        parms.log.error(err);
        return next(err);
      }
      return next();
    });
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};

module.exports = {
  tallyAccount: tallyAccount,
};
