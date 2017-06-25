/* global sinon, inject, assert, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('search.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute doSearch - call ajax', function () {
    let searchService = null;
    let ajaxService = null;
    let explistService = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_searchService_, _ajaxService_, _explistService_, _etmenuService_) {
        searchService = _searchService_;
        ajaxService = _ajaxService_;
        explistService = _explistService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should set flags & call ajax', function () {
      sinon.spy(ajaxService, 'query');

      const input = {
        cityId: 20140301,
        thinList: true,
        description: 'Kroger',
        amount: '100.50',
        catId: 175,
        acctId: 60,
        transMonth: 20140801,
        transYear: false,
        entryMonth: 20141231,
        entryYear: true
      };

      etmenuService.data.menu.city = {id: input.cityId};
      searchService.data.description = input.description;
      searchService.data.amount = input.amount;
      searchService.data.category = {id: input.catId};
      searchService.data.account = {id: input.acctId};
      searchService.data.transMonth = {id: input.transMonth, aggregate: input.transYear};
      searchService.data.entryMonth = {id: input.entryMonth, aggregate: input.entryYear};
      expect(explistService.data.loading).to.be.false;
      searchService.doSearch();

      // console.log(ajaxService.query.getCall(0).args[1]);
      assert(ajaxService.query.calledOnce);
      assert(ajaxService.query.calledWith('/search/go', input));
      expect(explistService.data.loading).to.be.true;
    });
    afterEach('rollback mocks', function () {
      if (ajaxService) {
        ajaxService.query.restore();
      }
    });
  });
  // case #2
  describe('Execute loadAll with $httpBackend', function () {
    let $httpBackend = null;
    let searchService = null;
    let explistService = null;
    let dashboardService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_searchService_, _explistService_, _dashboardService_) {
        searchService = _searchService_;
        explistService = _explistService_;
        dashboardService = _dashboardService_;
      });
    });
    beforeEach('', function () {
      inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', './search/go?amount=100.50&catId=175&description=Kroger&thinList=true').respond({code: 0, data: [{id: 8441, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 0, name: null}, description: 'ATM Cash', amount: 80, transDt: '2017-01-25', transMonth: '2017-01-01', seq: 8897, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 21879.93, balanceAf: 21799.93}, to: {id: 63, name: 'Cash - Bala', balanceBf: 4.719999999999999, balanceAf: 84.72}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}, {id: 8086, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 175, name: null}, description: 'Costco', amount: 44.84, transDt: '2016-09-18', transMonth: '2016-09-01', seq: 8896, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11299.13, balanceAf: 11343.969999999998}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}, {id: 8344, cityId: 20140301, entryDt: '2017-06-17T18:45:53-05:00', entryMonth: '2017-06-01', category: {id: 181, name: null}, description: 'Costco Returns', amount: -43.28, transDt: '2016-12-03', transMonth: '2016-12-01', seq: 8895, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11257.41, balanceAf: 11214.13}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: true, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}]});
      });
    });
    it('should make all ajax calls to fetch startup data', function () {
      $httpBackend.expectGET('./search/go?amount=100.50&catId=175&description=Kroger&thinList=true');

      const input = {
        thinList: true,
        description: 'Kroger',
        amount: '100.50',
        catId: 175
      };

      searchService.data.description = input.description;
      searchService.data.amount = input.amount;
      searchService.data.category = {id: input.catId};

      expect(explistService.data.loading).to.be.false;
      searchService.doSearch();
      expect(explistService.data.loading).to.be.true;
      expect(explistService.data.filterApplied).to.be.true;

      $httpBackend.flush();

      expect(explistService.data.thinList).to.be.true;
      expect(explistService.data.loading).to.be.false;
      expect(explistService.data.currPageNo).to.equal(0);
      expect(explistService.data.total).to.equal(81.56);
      expect(dashboardService.data.loading.donestep).to.equal(3);
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  after('do nothing', function () {});
});
