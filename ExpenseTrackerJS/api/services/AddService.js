'use strict';

const moment = require('moment');
const number = require('numeral');
const async = require('async');
const sugar = require('sugar');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();
const sequences = require('../api/models/Sequences')();
const cashService = require('./CashService');

let param = null;
let data = null;
const accts = {from: null, to: null};
let trans = null;

// params: {log, db}
// data: {}
const addExpense = function (params, data1, next) {
  // TODO Check if the city is active.
  param = params;
  data = data1;

  async.waterfall([getAccountsInfo, copyTransData, copyAccountsData, fetchTransSeq, saveTransaction,
    transferCash, getAccountsInfo, updateAfBalances], function cb(err) {
    logErr(param.log, err);
    return next(err);
  });
};

//* *************************************************//
// step 1 & 7 : fetch from & to accounts info from DB
const getAccountsInfo = function (next) {
  async.parallel({
    from: function (cb) {
      if(!data.fromAccount) {
        return cb();
      }
      getAccount(data.fromAccount.id, function aa(err, ac) {
        accts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!data.toAccount) {
        return cb();
      }
      getAccount(data.toAccount.id, function aa(err, ac) {
        accts.to = ac;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function done(err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 1.5 : fetches account info from DB
const getAccount = function (acctId, next) {
  accounts.findOne(param.db, {acctId: acctId}).then((doc) => {
    return next(null, doc);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 2: copy transaction data from input to transaction record.
const copyTransData = function (next) {
  trans = {
    transId: 0,
    cityId: data.city.id,
    entryDt: moment().valueOf(),
    entryMonth: moment().date(1).valueOf(),
    catId: data.category ? data.category.id : 0,
    description: sugar.String(data.description).capitalize(true, true).raw,
    amount: number(data.amount).value(),
    transDt: data.transDate,
    transMonth: moment(data.transDate).date(1).valueOf(),
    seq: 0,
    accounts: {from: null, to: null},
    adhoc: data.adhoc,
    adjust: data.adjust,
    status: true,
    tallied: false,
    tallyDt: null
  };
  return next();
};

// setp 3: copy accounts data from input to transaction record.
const copyAccountsData = function (next) {
  if(data.fromAccount) {
    trans.accounts.from = {
      acctId: accts.from.acctId,
      billId: accts.from.openBillId,
      balanceBf: accts.from.balance,
      balanceAf: accts.from.balance
    };
  } else {
    trans.accounts.from = {acctId: 0};
  }
  if(data.toAccount) {
    trans.accounts.to = {
      acctId: accts.to.acctId,
      billId: accts.to.openBillId,
      balanceBf: accts.to.balance,
      balanceAf: accts.to.balance
    };
  } else {
    trans.accounts.to = {acctId: 0};
  }
  return next();
};

// step 4 : fetch transactions sequence from DB
const fetchTransSeq = function (next) {
  sequences.getNextSeq(db, {seqId: 'transactions', cityId: data.city.id}).then((seq) => {
    trans.transId = seq.seq;
    trans.seq = seq.seq;
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 5 : save transaction to DB
const saveTransaction = function (next) {
  transactions.insert(db, trans).then(() => {
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 6 : move cash across from / to accounts
const transferCash = function (next) {
  cashService.transferCash({db: param.db, log: param.log, fromId: accts.from.acctId,
    toId: accts.to.acctId, amount: trans.amount, seq: 0}, function cb(err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 8 : update transaction with updated account AF balances
const updateAfBalances = function (next) {
  transactions.update(db, {transId: trans.transId}, {$set: {'accounts.from.balanceAf': accts.from.balance,
    'accounts.to.balanceAf': accts.to.balance}}).then(() => {
      return next();
    }).catch((err) => {
      logErr(param.log, err);
      return next(err);
    });
};

const logErr = function (log, err) {
  if(err) {
    log.error(err);
  }
};

module.exports = {
  addExpense: addExpense,
};
