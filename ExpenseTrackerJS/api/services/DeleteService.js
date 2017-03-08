'use strict';

const async = require('async');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions')();
const cashService = require('./CashService');

let param = null;

const deleteExpense = function (params, next) {
  param = params;

  async.waterfall([checkCityEditable, getTransInfo, getAccountsInfo, modifyBillBalance, reverseCash,
    deleteTransaction], function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

//* *************************************************//
// setp 1: check city is editable.
const checkCityEditable = function (next) {
  // TODO implement City editable check..
  // TODO check if both accounts are active ??
  return next(null);
};

// step 2: fetch transaction info from DB
const getTransInfo = function (next) {
  transactions.findById(param.db, param.transId).then((trans) => {
    return next(null, trans);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 3: fetch from & to accounts info from DB
const getAccountsInfo = function (trans, next) {
  const accts = {from: null, to: null};

  async.parallel({
    from: function (cb) {
      if(!trans.accounts.from.id) {
        accts.from = {id: 0, balance: 0};
        return cb();
      }
      getAccount(trans.accounts.from.id, function (err, ac) {
        accts.from = ac;
        logErr(param.log, err);
        return cb(err);
      });
    },
    to: function (cb) {
      if(!trans.accounts.to.id) {
        accts.to = {id: 0, balance: 0};
        return cb();
      }
      getAccount(trans.accounts.to.id, function (err, ac) {
        accts.to = ac;
        logErr(param.log, err);
        return cb(err);
      });
    }
  }, function (err) {
    logErr(param.log, err);
    return next(err, trans, accts);
  });
};

// step 3.5: fetch account info from DB
const getAccount = function (id, next) {
  accounts.findById(param.db, id).then((acct) => {
    return next(null, acct);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// step 4: if the expense has been included in a bill, deduct the bill amount & balance.
const modifyBillBalance = function (trans, accts, next) {
  if(!trans.bill) {
    return next(null, trans, accts);
  }
  updateBill(trans.bill.id, trans.amount, function (err) {
    logErr(param.log, err);
    return next(err, trans, accts);
  });
};

// step 4.5: decrement the bill amount & balance with the trans amount.
const updateBill = function (id, amount, next) {
  bills.findOneAndUpdate(param.db, {id: id}, {$inc: {amount: -amount, balance: -amount}}).then(() => {
    return next();
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 5: move cash across from / to accounts. Reverse the from / to accounts.
const reverseCash = function (trans, accts, next) {
  cashService.transferCash({db: param.db, log: param.log, from: accts.to,
    to: accts.from, amount: trans.amount, seq: trans.seq}, function (err) {
    logErr(param.log, err);
    return next(err);
  });
};

// step 6: delete transaction record from DB
const deleteTransaction = function (next) {
  transactions.remove(param.db, {id: param.transId}).then(() => {
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
  deleteExpense: deleteExpense,
};
