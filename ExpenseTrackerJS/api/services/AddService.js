'use strict';

const moment = require('moment');
const numeral = require('numeral');
const async = require('async');
const sugar = require('sugar');
const accounts = require('../models/Accounts')();
const transactions = require('../models/Transactions')();
const sequences = require('../models/Sequences')();
const cashService = require('./CashService');

let param = null;
let data = null;
let trans = null;

// params: {log, db}
// data: {}
const addExpense = function (params, data1, next) {
  // TODO Check if the city is active.
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, copyTransData, copyAccountsData, fetchTransSeq,
    saveTransaction, transferCash, getAccountsInfo, updateAfBalances], function (err) {
    logErr(param.log, err);
    return next(err, trans);
  });
};

// setp 1: check city is editable.
const checkCityEditable = function (next) {
  // TODO implement City editable check..
  return next(null);
};

// setp 2: copy transaction data from input to transaction record.
const copyTransData = function (next) {
  trans = {
    id: 0,
    cityId: data.city.id,
    entryDt: moment().valueOf(),
    entryMonth: moment().date(1).valueOf(),
    category: {id: 0, name: ' ~ '},
    description: sugar.String(data.description).capitalize(false, true).raw,
    amount: numeral(data.amount).value(),
    transDt: moment(data.transDt, 'DD-MMM-YYYY').valueOf(),
    transMonth: moment(data.transDt, 'DD-MMM-YYYY').date(1).valueOf(),
    seq: 0,
    accounts: {from: null, to: null},
    adhoc: data.adhoc,
    adjust: data.adjust,
    status: true,
    tallied: false,
    tallyDt: null
  };
  if(data.category) {
    trans.category.id = data.category.id;
    trans.category.name = data.category.mainDesc + ' ~ ' + data.category.subDesc;
  }
  return next();
};

// setp 3: copy accounts data from input to transaction record.
const copyAccountsData = function (next) {
  if(data.fromAccount) {
    trans.accounts.from = {
      id: data.fromAccount.id,
      name: data.fromAccount.name,
      billId: data.fromAccount.bills ? data.fromAccount.bills.open.id : 0,
      balanceBf: data.fromAccount.balance,
      balanceAf: data.fromAccount.balance
    };
  } else {
    trans.accounts.from = {id: 0, name: '', billId: 0, balanceBf: 0, balanceAf: 0};
  }
  if(data.toAccount) {
    trans.accounts.to = {
      id: data.toAccount.id,
      name: data.toAccount.name,
      billId: data.toAccount.bills ? data.toAccount.bills.open.id : 0,
      balanceBf: data.toAccount.balance,
      balanceAf: data.toAccount.balance
    };
  } else {
    trans.accounts.to = {id: 0, name: '', billId: 0, balanceBf: 0, balanceAf: 0};
  }
  return next();
};

// step 4 : fetch transactions sequence from DB
const fetchTransSeq = function (next) {
  sequences.getNextSeq(param.db, {seqId: 'transactions', cityId: data.city.id}).then((seq) => {
    trans.id = seq.seq;
    trans.seq = seq.seq;
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 5 : save transaction to DB
const saveTransaction = function (next) {
  transactions.insert(param.db, trans).then(() => {
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 6 : move cash across from / to accounts
const transferCash = function (next) {
  cashService.transferCash({db: param.db, log: param.log, from: data.fromAccount,
    to: data.toAccount, amount: trans.amount, seq: 0}, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

//* *************************************************//
// step 7 : fetch from & to accounts info from DB
const getAccountsInfo = function (next) {
  const accts = {from: null, to: null};

  async.parallel({
    from: function (cb) {
      if(!data.fromAccount) {
        accts.from = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.fromAccount.id, function (err, ac) {
        accts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!data.toAccount) {
        accts.to = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.toAccount.id, function (err, ac) {
        accts.to = ac;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err, accts);
  });
};

// step 7.5 : fetches account info from DB
const getAccount = function (id, next) {
  accounts.findById(param.db, id).then((doc) => {
    return next(null, doc);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 8 : update transaction with updated account AF balances
const updateAfBalances = function (accts, next) {
  transactions.update(param.db, {id: trans.id}, {$set: {'accounts.from.balanceAf': accts.from.balance,
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
