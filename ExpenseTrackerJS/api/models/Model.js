'use strict';

const Model = function (coll) {
  this.collection = coll;
};

Model.prototype = {
  findOne: function (db, filter, options) {
    return db.get(this.collection).findOne(filter, options || {});
  },
  find: function (db, filter, options) {
    return db.get(this.collection).find(filter, options || {});
  },
  findAll: function (db, options) {
    return db.get(this.collection).find({}, options || {});
  },
  distinct: function (db, field, filter, options) {
    return db.get(this.collection).distinct(field, filter || {}, options || {});
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
