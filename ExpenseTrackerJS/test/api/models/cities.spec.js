/* eslint no-magic-numbers: "off", no-console: "off" */

'use strict';
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const expect = chai.expect;
const mongo = require('../../../api/config/mongodb-config.js');
const cities = require('../../../api/models/Cities.js')();

describe('models.cities', function () {
  let db = null;

  before('get db connection', function (done) {
    mongo.ping(null, function (errr, db1) {
      db = db1;
      done();
    });
  });
  describe('findAllCities', function () {
    it('should fetch all cities', function (done) {
      cities.findAllCities(db).then((cits) => {
        cits.should.contain.some.with.property('active', true);
        cits.should.contain.some.with.property('active', false);
        done();
      });
    });
  });
  describe('findActive', function () {
    it('should fetch active cities', function (done) {
      cities.findActive(db).then((cits) => {
        cits.should.all.have.property('active', true);
        done();
      });
    });
  });
  describe('findDefault', function () {
    it('should fetch default city', function (done) {
      cities.findDefault(db).then((city) => {
        expect(city).to.have.property('default', true);
        done();
      });
    });
  });

  after('close db connection', function () {
    // do nothing.
  });
});
