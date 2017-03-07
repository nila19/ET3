'use strict';

const model = require('./Model');
const schema = {
  seqId: 'string not-null primarykey',
  cityId: 'int not-null',
  seq: 'int not-null',
  FLAGS: {},
};

const Sequences = function () {
  // do nothing
  this.FLAGS = schema.FLAGS;
};

Sequences.prototype = model('sequences');
Sequences.prototype.getNextSeq = function (db, filter) {
  // return db.get(this.collection).findAndModify({query: filter, update: {$inc: {seq: 1}}, new: true});
  // return db.get(this.collection).findOneAndUpdate(filter, {$inc: {seq: 1}}, {returnOriginal: false});
  return this.findOneAndUpdate(db, filter, {$inc: {seq: 1}}, {returnOriginal: false});
};

module.exports = function () {
  return new Sequences();
};
