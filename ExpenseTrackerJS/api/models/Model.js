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
  findOneAndUpdate: function (db, filter, mod, options) {
    return db.get(this.collection).findOneAndUpdate(filter, mod, options || {fields: {_id: 0}, returnOriginal: false});
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
  // removeAll: function (db) {
  //   return db.get(this.collection).remove({});
  // },
  insert: function (db, data) {
    return db.get(this.collection).insert(data);
  },
  update: function (db, filter, mod, options) {
    let opt = {multi: true, upsert: true};

    // embed the multi/upsert options based on input options.
    opt = options ? Object.assign({}, opt, options) : opt;
    return db.get(this.collection).update(filter, mod, opt);
  }
};

module.exports = function (coll) {
  return new Model(coll);
};
