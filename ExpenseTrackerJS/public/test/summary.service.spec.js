/* global sinon, inject, assert, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('summary.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute loadSummary - call ajax', function () {
    let summaryService = null;
    let ajaxService = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_summaryService_, _ajaxService_, _etmenuService_) {
        summaryService = _summaryService_;
        ajaxService = _ajaxService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should set flags & call ajax', function () {
      sinon.spy(ajaxService, 'query');

      expect(etmenuService.data.loading).to.be.false;
      summaryService.loadSummary();
      assert(ajaxService.query.calledOnce);
      assert(ajaxService.query.calledWith('/summary/go'));
      expect(etmenuService.data.loading).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.query.restore();
    });
  });
  // case #2
  describe('Execute loadAll with $httpBackend', function () {
    let summaryService = null;
    let $httpBackend = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_summaryService_, _etmenuService_) {
        summaryService = _summaryService_;
        etmenuService = _etmenuService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', './summary/go?adhoc=true&forecast=false&regular=true').respond({code: 0, data: [{amount: [9544.3, 25.45, 401, 105.8, 1962.57, 9544.3, 25.45, 401, 105.8, 1962.57, 9544.3, 25.45, 401, 105.8, 1962.57], count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {category: {id: 170, name: 'House ~ Rent', cityId: 20140301, mainDesc: 'House', subDesc: 'Rent', icon: 'home', active: true, seq: 11}, amount: [3031.39, 0, 0, 0, 1033.7, 3031.39, 0, 0, 0, 1033.7, 3031.39, 0, 0, 0, 1033.7], count: [3, 0, 0, 0, 1, 3, 0, 0, 0, 1, 3, 0, 0, 0, 1]}, {category: {id: 171, name: 'House ~ Electricity', cityId: 20140301, mainDesc: 'House', subDesc: 'Electricity', icon: 'power', active: true, seq: 13}, amount: [252.99, 25.45, 0, 25.2, 0, 252.99, 25.45, 0, 25.2, 0, 252.99, 25.45, 0, 25.2, 0], count: [5, 1, 0, 2, 0, 5, 1, 0, 2, 0, 5, 1, 0, 2, 0]}]});
    }));
    it('should make all ajax calls to fetch startup data', function () {
      $httpBackend.expectGET('./summary/go?adhoc=true&forecast=false&regular=true');

      // data set up SummaryController
      summaryService.data.months.length = 15;
      summaryService.data.columns = 13;
      expect(etmenuService.data.loading).to.be.false;
      summaryService.loadSummary();
      expect(etmenuService.data.loading).to.be.true;
      // expect(summaryService.data.input.cityId).to.equal(20140301);
      $httpBackend.flush();

      expect(summaryService.data.totalrow.amount.length).to.equal(15);
      expect(summaryService.data.rows.length).to.equal(2);
      expect(summaryService.data.maxPageNo).to.equal(1);
      expect(summaryService.data.currPageNo).to.equal(0);
      expect(summaryService.data.pgData.months.length).to.equal(13);
      expect(summaryService.data.pgData.totalrow.length).to.equal(13);
      expect(summaryService.data.pgData.rows.length).to.equal(2);
      expect(etmenuService.data.loading).to.be.false;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  after('do nothing', function () {});
});
