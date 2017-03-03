'use strict';

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  account: {id: 'int not-null', name: 'string'},
  createdDt: 'timestamp',
  billDt: 'date',
  dueDt: 'date',
  closed: 'boolean',
  amount: 'float',
  balance: 'float',
  payments: [{id: 'int', transDt: 'date', amount: 'float'}],
  FLAGS: {}
};

const Bills = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Bills.prototype = model('bills');
// paidInd == null, get all; paidInd = 'N', getUnpaid only, paidInd = 'Y', getPaid only
Bills.prototype.findForCity = function (db, cityId, paidInd) {
  const filter = {cityId: cityId, closed: true};

  if(paidInd) {
    filter.balance = (paidInd === 'Y') ? 0: {$gt: 0};
  }
  return this.find(db, filter, {fields: {_id: 0}, sort: {billDt: -1}});
};
// TODO Unsed ???
Bills.prototype.findForCityOpen = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    closed: false
  }, {fields: {_id: 0}, sort: {billDt: -1}});
};

// paidInd == null, get all; paidInd = 'N', getUnpaid only, paidInd = 'Y', getPaid only
Bills.prototype.findForAcct = function (db, acctId, paidInd) {
  const filter = {'account.id': acctId, closed: true};

  if(paidInd) {
    filter.balance = (paidInd === 'Y') ? 0: {$gt: 0};
  }
  return this.find(db, filter, {fields: {_id: 0}, sort: {billDt: -1}});
};

module.exports = function () {
  return new Bills();
};
