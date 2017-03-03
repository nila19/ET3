'use strict';

const Model = function (coll) {
  this.collection = coll;
};

Model.prototype = {
  findById: function (db, id) {
    return db.get(this.collection).findOne({id: id}, {fields: {_id: 0}});
  },
  findOne: function (db, filter, options) {
    return db.get(this.collection).findOne(filter, options || {fields: {_id: 0}});
  },
  find: function (db, filter, options) {
    return db.get(this.collection).find(filter, options || {fields: {_id: 0}});
  },
  findAll: function (db, options) {
    return db.get(this.collection).find({}, options || {fields: {_id: 0}});
  },
  distinct: function (db, field, filter, options) {
    return db.get(this.collection).distinct(field, filter || {}, options || {fields: {_id: 0}});
  },
  remove: function (db, filter) {
    return db.get(this.collection).remove(filter);
  },
  removeAll: function (db) {
    return db.get(this.collection).remove({});
  },
  insert: function (db, data) {
    return db.get(this.collection).insert(data);
  },
  update: function (db, filter, mod, options) {
    // TODO Embed the multi/upsert options based on input options.
    return db.get(this.collection).update(filter, mod, options || {
      multi: true,
      upsert: true
    });
  }
};

module.exports = function (coll) {
  return new Model(coll);
};
