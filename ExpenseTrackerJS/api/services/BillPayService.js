'use strict';

const async = require('async');
const addservice = require('./AddService');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();

let param = null;
let data = null;

const payBill = function (params, data1, next) {
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, getAccountInfo, buildTransInput, addTransaction,
    updateBill], function (err, trans) {
    logErr(param.log, err);
    return next(err, trans);
  });
};

// setp 1: check city is editable.
const checkCityEditable = function (next) {
  // TODO implement City editable check..
  return next(null);
};

//* *************************************************//
// step 7 : fetch from & to accounts info from DB
const getAccountInfo = function (next) {
  accounts.findById(param.db, data.bill.account.id).then((acct) => {
    return next(null, acct);
  }).catch((err) => {
    logErr(param.log, err);
    return next(err);
  });
};

// setp 2: copy transaction data from input to transaction record.
// {city, fromAccount, toAccount, category, description, amount, transDt, adjust, adhoc}
const buildTransInput = function (acct, next) {
  const input = {
    city: data.city,
    fromAccount: data.account,
    toAccount: acct,
    category: null,
    description: 'CC Bill Payment',
    amount: data.bill.balance,
    transDt: data.paidDt,
    adhoc: false,
    adjust: true
  };

  return next(null, input);
};

// step 4 : fetch transactions sequence from DB
const addTransaction = function (input, next) {
  addservice.addExpense(param, input, function (err, trans) {
    logErr(param.log, err);
    return next(err, trans);
  });
};

// step 5 : save transaction to DB
const updateBill = function (trans, next) {
  const payment = {
    id: trans.id,
    transDt: trans.transDt,
    amount: trans.amount
  };
  let balance = data.bill.balance - trans.amount;

  if(balance > -0.01 && balance < 0.01) {
    balance = 0;
  }

  bills.update(param.db, {id: data.bill.id}, {$set: {balance: balance}, $push: {payments: payment}}).then(() => {
    return next(null, trans);
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
  payBill: payBill,
};
