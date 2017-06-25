/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('explistwrapper.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute few functions', function () {
    let explistwrapperService = null;
    let explistService = null;
    let searchService = null;
    let etmenuService = null;
    let billsService = null;
    let accountsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_explistwrapperService_, _explistService_, _searchService_, _etmenuService_, _billsService_, _accountsService_) {
        explistwrapperService = _explistwrapperService_;
        explistService = _explistService_;
        searchService = _searchService_;
        etmenuService = _etmenuService_;
        billsService = _billsService_;
        accountsService = _accountsService_;
      });
    });
    it('should reloadExpenses', function () {
      sinon.spy(searchService, 'doSearch');

      explistService.data.thinList = true;
      searchService.data.thinList = false;
      explistwrapperService.reloadExpenses();

      expect(searchService.data.thinList).to.be.true;
      expect(searchService.doSearch.calledOnce).to.be.true;
    });
    it('should clearFilter - SEARCH', function () {
      sinon.spy(searchService, 'doSearch');
      searchService.data.description = 'Kroger';
      explistService.data.thinList = true;
      searchService.data.thinList = false;
      etmenuService.data.page = 'SEARCH';
      accountsService.data.filterBy = 60;

      explistwrapperService.clearFilter();

      expect(searchService.data.description).to.be.null;
      expect(searchService.data.thinList).to.be.true;
      expect(accountsService.data.filterBy).to.equal(60);
      expect(searchService.doSearch.calledOnce).to.be.true;
    });
    it('should clearFilter - DASHBOARD, clear filter for bills', function () {
      sinon.spy(searchService, 'doSearch');
      sinon.spy(billsService, 'clearBillsList');
      sinon.spy(billsService, 'loadBills');
      searchService.data.description = 'Kroger';
      explistService.data.thinList = true;
      searchService.data.thinList = false;
      billsService.data.filterApplied = true;
      etmenuService.data.page = 'DASHBOARD';
      accountsService.data.filterBy = 60;

      explistwrapperService.clearFilter();

      expect(searchService.data.description).to.be.null;
      expect(searchService.data.thinList).to.be.true;
      expect(billsService.data.filterApplied).to.be.false;
      expect(billsService.data.filterBy).to.be.null;
      expect(accountsService.data.filterBy).to.be.null;
      expect(searchService.doSearch.calledOnce).to.be.true;
      expect(billsService.clearBillsList.calledOnce).to.be.true;
      expect(billsService.loadBills.calledOnce).to.be.true;

      billsService.clearBillsList.restore();
      billsService.loadBills.restore();
    });
    it('should clearFilter - DASHBOARD, clear filter for bills', function () {
      sinon.spy(searchService, 'doSearch');
      sinon.spy(billsService, 'clearBillsList');
      sinon.spy(billsService, 'loadBills');
      searchService.data.description = 'Kroger';
      explistService.data.thinList = true;
      searchService.data.thinList = false;
      billsService.data.filterApplied = true;
      etmenuService.data.page = 'DASHBOARD';
      accountsService.data.filterBy = 60;

      explistwrapperService.clearFilter();

      expect(searchService.data.description).to.be.null;
      expect(searchService.data.thinList).to.be.true;
      expect(billsService.data.filterApplied).to.be.false;
      expect(billsService.data.filterBy).to.be.null;
      expect(accountsService.data.filterBy).to.be.null;
      expect(searchService.doSearch.calledOnce).to.be.true;
      expect(billsService.clearBillsList.calledOnce).to.be.true;
      expect(billsService.loadBills.calledOnce).to.be.true;

      billsService.clearBillsList.restore();
      billsService.loadBills.restore();
    });
    it('should clearFilter - DASHBOARD, no clear filter for bills', function () {
      sinon.spy(searchService, 'doSearch');
      sinon.spy(billsService, 'clearBillsList');
      sinon.spy(billsService, 'loadBills');
      searchService.data.description = 'Kroger';
      explistService.data.thinList = true;
      searchService.data.thinList = false;
      billsService.data.filterApplied = true;
      etmenuService.data.page = 'DASHBOARD';
      accountsService.data.filterBy = null;

      explistwrapperService.clearFilter();

      expect(searchService.data.description).to.be.null;
      expect(searchService.data.thinList).to.be.true;
      expect(billsService.data.filterApplied).to.be.true;
      expect(billsService.data.filterBy).to.be.null;
      expect(accountsService.data.filterBy).to.be.null;
      expect(searchService.doSearch.calledOnce).to.be.true;
      expect(billsService.clearBillsList.calledOnce).to.be.false;
      expect(billsService.loadBills.calledOnce).to.be.false;

      billsService.clearBillsList.restore();
      billsService.loadBills.restore();
    });
    afterEach('rollback mocks', function () {
      searchService.doSearch.restore();
    });
  });
  // case #1
  describe('Execute addItem, modifyItem, deleteItem', function () {
    let explistwrapperService = null;
    let explistService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_explistwrapperService_, _explistService_, _ajaxService_) {
        explistwrapperService = _explistwrapperService_;
        explistService = _explistService_;
        ajaxService = _ajaxService_;
      });
    });
    beforeEach('prepare app', function () {
      sinon.spy(ajaxService, 'get');
      sinon.spy(explistService, 'deleteItem');
    });
    it('should addItem', function () {
      explistwrapperService.addItem(8771);
      expect(ajaxService.get.calledOnce).to.be.true;
      expect(ajaxService.get.calledWith('/dashboard/transaction/8771')).to.be.true;
    });
    it('should modifyItem', function () {
      explistwrapperService.modifyItem(8771);
      expect(ajaxService.get.calledOnce).to.be.true;
      expect(ajaxService.get.calledWith('/dashboard/transaction/8771')).to.be.true;
    });
    it('should deleteItem', function () {
      explistwrapperService.deleteItem(8771);
      expect(explistService.deleteItem.calledOnce).to.be.true;
      expect(explistService.deleteItem.calledWith(8771)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.get.restore();
      explistService.deleteItem.restore();
    });
  });
  // case #2
  describe('Execute addItem, modifyItem - make ajax call', function () {
    let $httpBackend = null;
    let explistwrapperService = null;
    let explistService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_explistwrapperService_, _explistService_) {
        explistwrapperService = _explistwrapperService_;
        explistService = _explistService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      sinon.spy(explistService, 'addItem');
      sinon.spy(explistService, 'modifyItem');
    }));
    it('should execute addItem, call ajax & load data.', function () {
      const dt = {code: 0, data: {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2001.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: 0}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}};

      $httpBackend.when('GET', './dashboard/transaction/8771').respond(dt);
      $httpBackend.expectGET('./dashboard/transaction/8771');

      explistwrapperService.addItem(8771);
      $httpBackend.flush();

      expect(explistService.addItem.calledOnce).to.be.true;
      expect(explistService.addItem.calledWith(dt.data)).to.be.true;
    });
    it('should execute modifyItem, call ajax & load data.', function () {
      const dt = {code: 0, data: {id: 8946, cityId: 20140301, entryDt: '2017-06-22T00:59:38-05:00', entryMonth: '2017-06-01', category: {id: 174, name: 'Network ~ Mobile'}, description: 'US Mobile', amount: 10, transDt: '2017-06-12', transMonth: '2017-06-01', seq: 8946, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 2001.8600000000001, balanceAf: 2001.8600000000001}, to: {id: 0, name: '', balanceBf: 0, balanceAf: 0}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}};

      $httpBackend.when('GET', './dashboard/transaction/8771').respond(dt);
      $httpBackend.expectGET('./dashboard/transaction/8771');

      explistwrapperService.modifyItem(8771);
      $httpBackend.flush();

      expect(explistService.modifyItem.calledOnce).to.be.true;
      expect(explistService.modifyItem.calledWith(dt.data)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      explistService.addItem.restore();
      explistService.modifyItem.restore();
    });
  });
  // case #3
  describe('Execute swapExpense', function () {
    let explistwrapperService = null;
    let explistService = null;
    let ajaxService = null;
    let clock = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_explistwrapperService_, _explistService_, _ajaxService_) {
        explistwrapperService = _explistwrapperService_;
        explistService = _explistService_;
        ajaxService = _ajaxService_;
      });
    });
    beforeEach('prepare app', function () {
      sinon.stub(ajaxService, 'post');
      sinon.spy(explistService, 'loadCurrentPage');
      clock = sinon.useFakeTimers();
    });
    it('should swapExpense', function () {
      explistService.data.rows = [{id: 8771, cityId: 20140301, entryDt: '2017-06-12T00:15:54-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 150.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8771, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22030.68, balanceAf: 21980.43}, to: {id: 60, name: 'BOA Visa', balanceBf: 11377.82, balanceAf: 11327.57}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8770, cityId: 20140301, entryDt: '2017-06-12T00:15:34-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 250.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8770, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22080.93, balanceAf: 22030.68}, to: {id: 60, name: 'BOA Visa', balanceBf: 11428.07, balanceAf: 11377.82}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8769, cityId: 20140301, entryDt: '2017-06-12T00:12:47-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 350.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8769, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22131.18, balanceAf: 22080.93}, to: {id: 60, name: 'BOA Visa', balanceBf: 11478.32, balanceAf: 11428.07}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8768, cityId: 20140301, entryDt: '2017-06-12T00:10:21-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 450.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8768, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22181.43, balanceAf: 22131.18}, to: {id: 60, name: 'BOA Visa', balanceBf: 11528.57, balanceAf: 11478.32}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8767, cityId: 20140301, entryDt: '2017-06-12T00:09:44-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 550.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8767, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22231.68, balanceAf: 22181.43}, to: {id: 60, name: 'BOA Visa', balanceBf: 11578.82, balanceAf: 11528.57}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8766, cityId: 20140301, entryDt: '2017-06-12T00:05:16-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 650.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8766, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22281.93, balanceAf: 22231.68}, to: {id: 60, name: 'BOA Visa', balanceBf: 11629.07, balanceAf: 11578.82}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8763, cityId: 20140301, entryDt: '2017-06-12T00:04:37-05:00', entryMonth: '2017-06-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 750.25, transDt: '2017-05-15', transMonth: '2017-05-01', seq: 8763, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22332.18, balanceAf: 22281.93}, to: {id: 60, name: 'BOA Visa', balanceBf: 11679.32, balanceAf: 11629.07}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}, {id: 8571, cityId: 20140301, entryDt: '2017-04-17T15:12:23-05:00', entryMonth: '2017-04-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 850, transDt: '2017-04-12', transMonth: '2017-04-01', seq: 8571, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22598.88, balanceAf: 22548.88}, to: {id: 83, name: 'Chase Freedom', balanceBf: -801.74, balanceAf: -851.74}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}, {id: 8570, cityId: 20140301, entryDt: '2017-04-17T15:10:05-05:00', entryMonth: '2017-04-01', category: {id: 0, name: ' ~ '}, description: 'CC Bill Payment', amount: 100, transDt: '2017-04-11', transMonth: '2017-04-01', seq: 8570, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 22698.88, balanceAf: 22598.88}, to: {id: 60, name: 'BOA Visa', balanceBf: 10875.58, balanceAf: 10775.58}}, adhoc: false, adjust: true, status: true, tallied: true, tallyDt: '2017-06-22T00:11:27-05:00'}];
      expect(explistwrapperService.data.looperOn).to.be.false;
      explistwrapperService.swapExpense(4, 6);
      expect(explistwrapperService.data.looperOn).to.be.true;
      clock.tick(1100);
      expect(explistService.data.rows[4].amount).to.equal(750.25);
      expect(explistService.data.rows[6].amount).to.equal(550.25);
      expect(explistwrapperService.data.swapPool.length).to.equal(1);
      expect(explistService.loadCurrentPage.calledOnce).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.post.restore();
      explistService.loadCurrentPage.restore();
      clock.restore();
    });
  });
  after('do nothing', function () {});
});
