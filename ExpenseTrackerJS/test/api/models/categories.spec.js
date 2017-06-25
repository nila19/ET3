/* eslint no-magic-numbers: "off", no-console: "off" */

'use strict';
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const mongo = require('../../../api/config/mongodb-config.js');
const categories = require('../../../api/models/Categories.js')();

describe('models.categories', function () {
  const cityId = 20140301;
  let db = null;

  before('get db connection', function (done) {
    mongo.ping(null, function (errr, db1) {
      db = db1;
      done();
    });
  });
  describe('findForCity', function () {
    it('should fetch all categories', function (done) {
      categories.findForCity(db, cityId).then((cats) => {
        cats.should.all.have.property('cityId', cityId);
        done();
      });
    });
  });

  after('close db connection', function () {
    // do nothing.
  });
});
