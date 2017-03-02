'use strict';

const model = require('./Model');
const schema = {
  acctId: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  description: 'string not-null',
  balance: 'float default-0',
  type: 'string default-C',
  status: 'string default-A',
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
  FLAGS: {
    type: {CASH: 'C', CREDIT: 'R'},
    status: {ACTIVE: 'A', INACTIVE: 'I'},
//    billed: {YES: 'Y', NO: 'N'},
  },
};

const Accounts = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Accounts.prototype = model('accounts');
Accounts.prototype.findForCity = function (db, cityId) {
  return this.find(db, {cityId: cityId}, {sort: {status: 1, seq: 1}});
};
Accounts.prototype.findForCityActive = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    status: this.FLAGS.status.ACTIVE
  }, {
    sort: {seq: 1}
  });
};
Accounts.prototype.findForCityInactive = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    status: this.FLAGS.status.INACTIVE
  }, {
    sort: {seq: 1}
  });
};

module.exports = function () {
  return new Accounts();
};
