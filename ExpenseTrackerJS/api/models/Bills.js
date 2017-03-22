'use strict';

const Model = require('./Model');

const schema = {
  id: 'int not-null primarykey autoincrement',
  name: 'string',
  cityId: 'int not-null',
  account: {id: 'int not-null', name: 'string'},
  createdDt: 'timestamp',
  billDt: 'date',
  dueDt: 'date',
  closed: 'boolean',
  amount: 'float',
  balance: 'float',
  payments: [{id: 'int', transDt: 'date', amount: 'float'}]
};

class Bills extends Model {
  constructor() {
    super('bills');
    this.schema = schema;
  }
  // paid = null, get all; paid = 'N', getUnpaid only, paid = 'Y', getPaid only
  findForCity(db, cityId, paid) {
    const filter = {cityId: cityId, closed: true};

    if(paid) {
      filter.balance = (paid === 'Y') ? 0 : {$gt: 0};
    }
    return super.find(db, filter, {fields: {_id: 0}, sort: {billDt: -1}});
  }
  // paid = null, get all (including 'open', for modify dropdown); paid = 'N', getUnpaid only, paid = 'Y', getPaid only
  findForAcct(db, acctId, paid) {
    const filter = {'account.id': acctId};

    if(paid) {
      filter.balance = (paid === 'Y') ? 0: {$gt: 0};
      filter.closed = true;
    }
    return super.find(db, filter, {fields: {_id: 0}, sort: {billDt: -1}});
  }
  // used by billcloser
  findForCityOpen(db, cityId) {
    return super.find(db, {cityId: cityId, closed: false}, {fields: {_id: 0}, sort: {billDt: -1}});
  }
  // utility method
  getName(acct, bill) {
    return bill.id ? acct.name + ' : ' + bill.billDt + ' #' + bill.id : acct.name + ' #0';
  }
}

module.exports = function () {
  return new Bills();
};
