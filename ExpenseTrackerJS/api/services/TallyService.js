'use strict';

const moment = require('moment');
const async = require('async');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();
const tallyhistories = require('../models/TallyHistories')();
const sequences = require('../models/Sequences')();
const fmt = require('../config/formats');

let parms = null;
let tallyDt = null;

const tally = function (param, next) {
  parms = param;
  tallyDt = moment().format(fmt.YYYYMMDDHHmmss);

  async.waterfall([fetchAccount, checkCityEditable, updateAccount, fetchTallySeq,
    insertTallyHistory, updateTrans], function (err) {
    if(err) {
      parms.log.error(err);
    }
    return next(err);
  });
};

const fetchAccount = function (next) {
  accounts.findById(parms.db, parms.acctId).then((account) => {
    return next(null, account);
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const checkCityEditable = function (account, next) {
  // TODO implement City editable check..
  return next(null, account);
};
const updateAccount = function (account, next) {
  accounts.update(parms.db, {id: account.id}, {$set: {tallyBalance: account.balance, tallyDt: tallyDt}}).then(() => {
    return next(null, account);
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const fetchTallySeq = function (account, next) {
  sequences.getNextSeq(parms.db, {seqId: 'tallyhistories', cityId: account.cityId}).then((seq) => {
    return next(null, account, seq);
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const insertTallyHistory = function (account, seq, next) {
  const tallyObj = {
    id: seq.seq,
    account: {id: account.id, name: account.name},
    cityId: account.cityId,
    tallyDt: tallyDt,
    balance: account.balance};

  tallyhistories.insert(parms.db, tallyObj).then(() => {
    return next(null, account);
  }).catch((err) => {
    parms.log.error(err);
    return next(err);
  });
};
const updateTrans = function (account, next) {
  transactions.findForAcct(parms.db, account.cityId, account.id).then((trans) => {
    async.each(trans, function (tran, cb) {
      if(tran.tallied) {
        return cb();
      }
      transactions.update(parms.db, {id: tran.id}, {$set: {tallied: true, tallyDt: tallyDt}}).then(() => {
        return cb();
      }).catch((err) => {
        parms.log.error(err);
        return cb(err);
      });
    }, function (err) {
      logErr(parms.log, err);
      return next(err);
    });
  }).catch((err) => {
    logErr(parms.log, err);
    return next(err);
  });
};

const logErr = function (log, err) {
  if(err) {
    log.error(err);
  }
};

module.exports = {
  tally: tally,
};
