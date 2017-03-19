'use strict';

const Promise = require('bluebird');
const bills = require('../models/Bills')();

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  name: 'string not-null',
  balance: 'float default-0',
  cash: 'boolean',
  active: 'boolean',
  billed: 'boolean',
  icon: 'string default-home',
  color: 'string default-blue',
  seq: 'int',
  tallyBalance: 'float',
  tallyDt: 'timestamp',
  closingDay: 'int',
  dueDay: 'int',
  bills: {
    last: {},
    open: {id: 'int', name: 'string', billDt: 'timestamp', dueDt: 'timestamp', amount: 'float'}
  },
  FLAGS: {},
};

const Accounts = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Accounts.prototype = model('accounts');
Accounts.prototype.findForCityActive = function (db, cityId) {
  return new Promise(function (resolve, reject) {
    const promises = [];
    let accts = null;

    Accounts.prototype.find(db, {cityId: cityId, active: true}, {fields: {_id: 0}, sort: {seq: 1}}).then((acs) => {
      accts = acs;
      accts.forEach(function (acct) {
        promises.push(injectLastBill(db, acct));
        promises.push(injectOpenBill(db, acct));
      });
      return Promise.all(promises);
    }).then(() => {
      return resolve(accts);
    }).catch((err) => {
      return reject(err);
    });
  });
};
Accounts.prototype.findForCityInactive = function (db, cityId) {
  return this.find(db, {cityId: cityId, active: false}, {fields: {_id: 0}, sort: {seq: 1}});
};
Accounts.prototype.findBillable = function (db, cityId) {
  return this.find(db, {cityId: cityId, active: true, billed: true}, {fields: {_id: 0}, sort: {seq: 1}});
};

Accounts.prototype.findById = function (db, id) {
  return new Promise(function (resolve, reject) {
    let acct = null;

    Accounts.prototype.findOne(db, {id: id}).then((ac) => {
      acct = ac;
      const promises = [];

      promises.push(injectLastBill(db, acct));
      promises.push(injectOpenBill(db, acct));
      return Promise.all(promises);
    }).then(() => {
      return resolve(acct);
    }).catch((err) => {
      return reject(err);
    });
  });
};

const injectLastBill = function (db, acct) {
  return new Promise(function (resolve, reject) {
    if(!acct.billed || !acct.bills.last || !acct.bills.last.id) {
      return resolve(acct);
    }
    bills.findById(db, acct.bills.last.id).then((bill) => {
      acct.bills.last = bill;
      return resolve(acct);
    }).catch((err) => {
      return reject(err);
    });
  });
};
const injectOpenBill = function (db, acct) {
  return new Promise(function (resolve, reject) {
    if(!acct.billed || !acct.bills.open || !acct.bills.open.id) {
      return resolve(acct);
    }
    bills.findById(db, acct.bills.open.id).then((bill) => {
      acct.bills.open = bill;
      return resolve(acct);
    }).catch((err) => {
      return reject(err);
    });
  });
};

module.exports = function () {
  return new Accounts();
};
