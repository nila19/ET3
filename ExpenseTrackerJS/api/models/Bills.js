'use strict';

const model = require('./Model');
const schema = {
  billId: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  acctId: 'int not-null',
  createdDt: 'timestamp',
  billDt: 'date',
  dueDt: 'date',
  status: 'string',
  amount: 'float',
  balance: 'float',
  payments: [
    {transId: 'int', transDt: 'date', amount: 'float'}
  ],
  FLAGS: {
    status: {OPEN: 'O', CLOSED: 'C'}
  }
};

const Bills = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Bills.prototype = model('bills');
// paidInd == null, get all; paidInd = 'N', getUnpaid only, paidInd = 'Y', getPaid only
Bills.prototype.findForCity = function findForCity(db, cityId, paidInd) {
  const filter = {
    cityId: cityId,
    status: this.FLAGS.status.CLOSED,
  };

  if(paidInd) {
    filter.balance = (paidInd === 'Y') ? 0: {$gt: 0};
  }
  return this.find(db, filter, {sort: {billDt: -1}});
};
// TODO Unsed ???
Bills.prototype.findForCityOpen = function findForCityOpen(db, cityId) {
  return this.find(db, {
    cityId: cityId,
    status: this.FLAGS.status.OPEN
  }, {
    sort: {billDt: -1}
  });
};

// paidInd == null, get all; paidInd = 'N', getUnpaid only, paidInd = 'Y', getPaid only
Bills.prototype.findForAcct = function findForAcct(db, acctId, paidInd) {
  const filter = {
    acctId: acctId,
    status: this.FLAGS.status.CLOSED,
  };

  if(paidInd) {
    filter.balance = (paidInd === 'Y') ? 0: {$gt: 0};
  }
  return this.find(db, filter, {sort: {billDt: -1}});
};

module.exports = function exp() {
  return new Bills();
};
