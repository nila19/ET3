'use strict';

const async = require('async');
const addservice = require('./AddService');
const bills = require('../models/Bills')();

let param = null;
let data = null;

const payBill = function (params, data1, next) {
  param = params;
  data = data1;

  async.waterfall([checkCityEditable, buildTransInput, addTransaction, updateBill], function (err, trans) {
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
// {city, account.from, account.to, category, description, amount, transDt, adjust, adhoc}
const buildTransInput = function (next) {
  const input = {
    city: data.city,
    accounts: {from: data.account, to: data.bill.account},
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
