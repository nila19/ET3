/* eslint no-magic-numbers: "off", no-console: "off" */

'use strict';
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const mongo = require('../../../api/config/mongodb-config.js');
const tallies = require('../../../api/models/TallyHistories.js')();

describe('models.tallies', function () {
  const acctId = 83;
  let db = null;

  before('get db connection', function (done) {
    mongo.ping(null, function (errr, db1) {
      db = db1;
      done();
    });
  });
  describe('findForAcct', function () {
    it('should fetch all tallies for account', function (done) {
      tallies.findForAcct(db, acctId).then((tls) => {
        (tls.map((t) => t.account)).should.all.have.property('id', acctId);
        done();
      });
    });
  });

  after('close db connection', function () {
    // do nothing.
  });
});
