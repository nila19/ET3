'use strict';

const model = require('./Model');
const schema = {
  cityId: 'int not-null primarykey',
  description: 'string',
  status: 'string default-A',
  default: 'string default-N',
  currency: 'string default-USD',
  startDt: 'date',
  endDt: 'date',
  FLAGS: {
    default: {YES: 'Y', NO: 'N'},
    status: {ACTIVE: 'A', INACTIVE: 'I'},
  },
};

const Cities = function Cities() {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Cities.prototype = model('cities');
Cities.prototype.findAll = function findAll(db) {
  return this.findAll(db, {sort: {startDt: -1}});
};
Cities.prototype.findActive = function findActive(db) {
  return this.find(db, {status: this.FLAGS.status.ACTIVE}, {sort: {startDt: -1}});
};
Cities.prototype.findDefault = function findDefault(db) {
  return this.findOne(db, {default: this.FLAGS.default.YES});
};

module.exports = function exp() {
  return new Cities();
};
