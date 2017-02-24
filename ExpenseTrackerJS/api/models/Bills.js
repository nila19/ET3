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

const Bills = function Bills() {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Bills.prototype = model('bills');
Bills.prototype.findForCity = function findForCity(db, city, paid) {
  const filter = {
    cityId: city,
    status: this.FLAGS.status.CLOSED,
  };

  filter.balance = paid ? 0: {$gt: 0};
  return this.find(db, filter, {sort: {billDt: -1}});
};
Bills.prototype.findForCityOpen = function findForCityOpen(db, city) {
  return this.find(db, {
    cityId: city,
    status: this.FLAGS.status.OPEN
  }, {
    sort: {billDt: -1}
  });
};

// paidInd == 0, get all; paidInd > 0, getUnpaid only, paidInd < 0, getPaid only
Bills.prototype.findForAcct = function findForAcct(db, acct, paidInd) {
  const filter = {
    acctId: acct,
    status: this.FLAGS.status.CLOSED,
  };

  if(paidInd) {
    filter.balance = (paidInd < 0) ? 0: {$gt: 0};
  }
  return this.find(db, filter, {sort: {billDt: -1}});
};

module.exports = function exp() {
  return new Bills();
};
