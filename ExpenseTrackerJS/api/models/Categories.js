'use strict';

const Model = require('./Model');
const schema = {
  id: 'int not-null primarykey autoincrement',
  name: 'string',
  cityId: 'int not-null',
  mainDesc: 'string default-NA',
  subDesc: 'string default-NA',
  icon: 'string default- ',
  active: 'boolean',
  seq: 'int default-0'
};

class Categories extends Model {
  constructor() {
    super('categories');
    this.schema = schema;
  }
  findForCity(db, cityId) {
    return super.find(db, {cityId: cityId}, {fields: {_id: 0}, sort: {seq: 1}});
  }
  findForCityActive(db, cityId) {
    return super.find(db, {cityId: cityId, active: true}, {fields: {_id: 0}, sort: {seq: 1}});
  }
}

module.exports = function () {
  return new Categories();
};
