'use strict';

const model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  name: 'string',
  cityId: 'int not-null',
  mainDesc: 'string default-NA',
  subDesc: 'string default-NA',
  icon: 'string default- ',
  active: 'boolean',
  seq: 'int default-0',
  FLAGS: {},
};

const Categories = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Categories.prototype = model('categories');
Categories.prototype.findForCity = function (db, cityId) {
  return this.find(db, {cityId: cityId}, {fields: {_id: 0}, sort: {seq: 1}});
};
Categories.prototype.findForCityActive = function (db, cityId) {
  return this.find(db, {
    cityId: cityId,
    active: true,
  }, {fields: {_id: 0}, sort: {seq: 1}});
};

module.exports = function () {
  return new Categories();
};
