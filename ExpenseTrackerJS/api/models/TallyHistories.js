'use strict';

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  acctId: 'int not-null',
  cityId: 'int not-null',
  tallyDt: 'date',
  balance: 'float',
};

const TallyHistories = function () {
  // do nothing
  schema.tallyId;
};

TallyHistories.prototype = model('tallyhistories');
TallyHistories.prototype.findForAcct = function (db, acctId) {
  return this.find(db, {acctId: acctId}, {fields: {_id: 0}, sort: {id: -1}});
};

module.exports = function () {
  return new TallyHistories();
};
