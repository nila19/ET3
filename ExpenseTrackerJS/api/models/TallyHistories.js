'use strict';

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  account: {id: 'int not-null', name: 'string'},
  tallyDt: 'date',
  balance: 'float',
};

const TallyHistories = function () {
  // do nothing
  schema.tallyId;
};

TallyHistories.prototype = model('tallyhistories');
TallyHistories.prototype.findForAcct = function (db, acctId) {
  return this.find(db, {'account.id': acctId}, {fields: {_id: 0}, sort: {id: -1}});
};

module.exports = function () {
  return new TallyHistories();
};
