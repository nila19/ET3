'use strict';

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey',
  name: 'string',
  active: 'boolean',
  default: 'boolean',
  currency: 'string default-USD',
  startDt: 'date',
  endDt: 'date',
  FLAGS: {},
};

const Cities = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Cities.prototype = model('cities');
Cities.prototype.findAllCities = function (db) {
  return this.findAll(db, {fields: {_id: 0}, sort: {startDt: -1}});
};
Cities.prototype.findActive = function (db) {
  return this.find(db, {active: true}, {fields: {_id: 0}, sort: {startDt: -1}});
};
Cities.prototype.findDefault = function (db) {
  return this.findOne(db, {default: true});
};

module.exports = function () {
  return new Cities();
};
