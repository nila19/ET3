'use strict';

const model = require('./Model');
const schema = {
  cityId: 'int not-null primarykey',
  description: 'string',
  status: 'string default-A',
  default: 'boolean',
  currency: 'string default-USD',
  startDt: 'date',
  endDt: 'date',
  FLAGS: {
//    default: {YES: 'Y', NO: 'N'},
    status: {ACTIVE: 'A', INACTIVE: 'I'},
  },
};

const Cities = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Cities.prototype = model('cities');
Cities.prototype.findAllCities = function (db) {
  return this.findAll(db, {sort: {startDt: -1}});
};
Cities.prototype.findActive = function (db) {
  return this.find(db, {status: this.FLAGS.status.ACTIVE}, {sort: {startDt: -1}});
};
Cities.prototype.findDefault = function (db) {
  return this.findOne(db, {default: true});
};

module.exports = function () {
  return new Cities();
};
