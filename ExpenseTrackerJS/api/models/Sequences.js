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
Sequences.prototype.getNextSeq = function getNextSeq(db, filter) {
  return db.get(this.collection).findAndModify({query: filter, update: {$inc: {seq: 1}}, new: true});
};

module.exports = function exp() {
  return new Sequences();
};
