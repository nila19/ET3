/* global inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('etmenu.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute checkInit', function () {
    let etmenuService = null;
    let VALUES = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_etmenuService_, _VALUES_) {
        etmenuService = _etmenuService_;
        VALUES = _VALUES_;
      });
    });
    it('should set flags & call ajax', function () {
      VALUES.data = {
        city: {id: 20140301, name: 'Houston'},
        cities: [{id: 20140301, name: 'Houston'}, {id: 20090601, name: 'Chennai'}],
        env: 'dev'
      };

      expect(etmenuService.data.menu.env).to.be.null;
      expect(etmenuService.data.menu.city.id).to.be.undefined;
      etmenuService.checkInit();

      // console.log(ajaxService.query.getCall(0).args[1]);
      expect(etmenuService.data.menu.env).to.equal('dev');
      expect(etmenuService.data.menu.city.id).to.equal(20140301);
    });
    afterEach('rollback mocks', function () {});
  });
  after('do nothing', function () {});
});
