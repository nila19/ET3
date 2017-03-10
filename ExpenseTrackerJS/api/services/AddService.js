'use strict';

const moment = require('moment');
const numeral = require('numeral');
const async = require('async');
const sugar = require('sugar');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions')();
const sequences = require('../models/Sequences')();
const cashService = require('./CashService');
const fmt = require('../config/formats');

let param = null; // {db, log}
let data = null;  // {city, accounts {from:, to: }, category, description, amount, transDt, adjust, adhoc}
let trans = null;

const addExpense = function (params, data1, next) {
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, getAccountsInfo, copyTransData, copyAccountsData, fetchTransSeq,
    saveTransaction, transferCash, getAccountsInfo, updateAfBalances], function (err) {
    logErr(param.log, err);
    return next(err, trans);
  });
};

// setp 0: check city is editable.
const checkCityEditable = function (next) {
  // TODO implement City editable check..
  return next();
};

//* *************************************************//
// step 1, 7 : fetch from & to accounts info from DB
const getAccountsInfo = function (next) {
  async.parallel({
    from: function (cb) {
      if(!data.accounts.from || !data.accounts.from.id) {
        data.accounts.from = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.accounts.from.id, function (err, ac) {
        data.accounts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!data.accounts.to || !data.accounts.to.id) {
        data.accounts.to = {id: 0, balance: 0};
        return cb();
      }
      getAccount(data.accounts.to.id, function (err, ac) {
        data.accounts.to = ac;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 1.5, 7.5 : fetches account info from DB
const getAccount = function (id, next) {
  accounts.findById(param.db, id).then((doc) => {
    return next(null, doc);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 2: copy transaction data from input to transaction record.
const copyTransData = function (next) {
  trans = {
    id: 0,
    cityId: data.city.id,
    entryDt: moment().format(fmt.YYYYMMDDHHmmss),
    entryMonth: moment().date(1).format(fmt.YYYYMMDD),
    category: {id: 0, name: ' ~ '},
    description: sugar.String(data.description).capitalize(false, true).raw,
    amount: numeral(data.amount).value(),
    transDt: moment(data.transDt, fmt.DDMMMYYYY).format(fmt.YYYYMMDD),
    transMonth: moment(data.transDt, fmt.DDMMMYYYY).date(1).format(fmt.YYYYMMDD),
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
    trans.category.name = data.category.name;
  }
  return next();
};

// setp 3: copy accounts data from input to transaction record.
const copyAccountsData = function (next) {
  const from = data.accounts.from;
  const to = data.accounts.to;

  if(from) {
    trans.accounts.from = {
      id: from.id,
      name: from.name,
      balanceBf: from.balance,
      balanceAf: from.balance
    };
    if(from.billed && from.bills && from.bills.open) {
      trans.bill = {
        id: from.bills.open.id,
        account: {id: from.id, name: from.name},
        billDt: from.bills.open.billDt
      };
      trans.bill.name = bills.getName(from, trans.bill);
    }
  } else {
    trans.accounts.from = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
  }
  if(to) {
    trans.accounts.to = {
      id: to.id,
      name: to.name,
      balanceBf: to.balance,
      balanceAf: to.balance
    };
  } else {
    trans.accounts.to = {id: 0, name: '', balanceBf: 0, balanceAf: 0};
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
  cashService.transferCash({db: param.db, log: param.log, from: data.accounts.from,
    to: data.accounts.to, amount: trans.amount, seq: 0}, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 8 : update transaction with updated account AF balances
const updateAfBalances = function (next) {
  transactions.update(param.db, {id: trans.id}, {$set: {'accounts.from.balanceAf': data.accounts.from.balance,
    'accounts.to.balanceAf': data.accounts.to.balance}}).then(() => {
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
