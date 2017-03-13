'use strict';

const Promise = require('bluebird');
const addservice = require('./AddService');
const bills = require('../models/Bills')();
const cu = require('../utils/common-utils');

const payBill = function (parms, data, next) {
  cu.checkCityEditable(parms.db, data.city.id).then(() => {
    return buildTransInput(data);
  }).then((input) => {
    return addservice.addExpensePromise(parms, input);
  }).then((trans) => {
    return updateBill(parms, data, trans);
  }).then(() => {
    return next();
  }).catch((err) => {
    cu.logErr(parms.log, err);
    return next(err);
  });
};

// setp 2: copy transaction data from input to transaction record.
const buildTransInput = function (data) {
  return new Promise(function (resolve) {
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

    return resolve(input);
  });
};
// step 5 : save transaction to DB
const updateBill = function (parms, data, trans) {
  return new Promise(function (resolve, reject) {
    const pmt = {
      id: trans.id,
      transDt: trans.transDt,
      amount: trans.amount
    };
    let bal = data.bill.balance - trans.amount;

    if(bal > -0.01 && bal < 0.01) {
      bal = 0;
    }

    bills.update(parms.db, {id: data.bill.id}, {$set: {balance: bal}, $push: {payments: pmt}}).then(() => {
      return resolve();
    }).catch((err) => {
      return reject(err);
    });
  });
};

module.exports = {
  payBill: payBill,
};