'use strict';

const Model = function (coll) {
  this.collection = coll;
};

Model.prototype = {
  findOne: function findOne(db, filter, options) {
    return db.get(this.collection).findOne(filter, options || {});
  },
  find: function find(db, filter, options) {
    return db.get(this.collection).find(filter, options || {});
  },
  findAll: function findAll(db, options) {
    return db.get(this.collection).find({}, options || {});
  },
  distinct: function distinct(db, field, filter, options) {
    return db.get(this.collection).distinct(field, filter || {}, options || {});
  },
  remove: function remove(db, filter) {
    return db.get(this.collection).remove(filter);
  },
  removeAll: function removeAll(db) {
    return db.get(this.collection).remove({});
  },
  insert: function insert(db, data) {
    return db.get(this.collection).insert(data);
  },
  update: function update(db, filter, mod, options) {
    // TODO Embed the multi/upsert options based on input options.
    return db.get(this.collection).update(filter, mod, options || {
      multi: true,
      upsert: true
    });
  }
};

module.exports = function exp(coll) {
  return new Model(coll);
};
