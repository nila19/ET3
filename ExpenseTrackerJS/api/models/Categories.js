'use strict';

const model = require('./Model');
const schema = {
  catId: 'int not-null primarykey autoincrement',
  cityId: 'int not-null',
  mainDesc: 'string default-NA',
  subDesc: 'string default-NA',
  icon: 'string default- ',
  status: 'string default-A',
  seq: 'int default-0',
  FLAGS: {
    status: {ACTIVE: 'A', INACTIVE: 'I'}
  },
};

const Categories = function Categories() {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Categories.prototype = model('categories');
Categories.prototype.findForCity = function findForCity(db, city) {
  return this.find(db, {cityId: city}, {sort: {seq: 1}});
};
Categories.prototype.findForCityActive = function findForCityActive(db, city) {
  return this.find(db, {
    cityId: city,
    status: this.FLAGS.status.ACTIVE,
  }, {
    sort: {seq: 1}
  });
};

module.exports = function exp() {
  return new Categories();
};
