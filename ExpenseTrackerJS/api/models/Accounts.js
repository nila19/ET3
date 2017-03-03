'use strict';

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
  lastBillId: 'int',
  openBillId: 'int',
  FLAGS: {},
};

const Accounts = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Accounts.prototype = model('accounts');
Accounts.prototype.findForCity = function (db, cityId) {
  return this.find(db, {cityId: cityId}, {fields: {_id: 0}, sort: {active: -1, seq: 1}});
};
Accounts.prototype.findForCityActive = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    active: true
  }, {fields: {_id: 0}, sort: {seq: 1}});
};
Accounts.prototype.findForCityInactive = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    active: false
  }, {fields: {_id: 0}, sort: {seq: 1}});
};

module.exports = function () {
  return new Accounts();
};
