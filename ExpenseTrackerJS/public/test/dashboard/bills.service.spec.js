/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('bills.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute billswrapperService.showBillPay', function () {
    let billswrapperService = null;
    let billpayService = null;
    let billsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billswrapperService_, _billpayService_, _billsService_) {
        billswrapperService = _billswrapperService_;
        billpayService = _billpayService_;
        billsService = _billsService_;
      });
    });
    it('should showBillPay', function () {
      sinon.spy(billpayService, 'loadData');

      const bills = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      const bill = {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'};

      billsService.data.rows = bills;
      billswrapperService.showBillPay(85);

      expect(billpayService.loadData.calledOnce).to.be.true;
      expect(billpayService.loadData.calledWith(bill)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      billpayService.loadData.restore();
    });
  });
  // case #1
  describe('Execute few simple functions', function () {
    let billsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billsService_) {
        billsService = _billsService_;
      });
    });
    it('should clearBillsList', function () {
      billsService.data.openBills = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      billsService.data.closedBills = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      billsService.data.tab = 'CLOSED';

      billsService.clearBillsList();

      expect(billsService.data.openBills).to.be.null;
      expect(billsService.data.closedBills).to.be.null;
      expect(billsService.data.tab).to.equal('OPEN');
    });
    it('should loadCurrentPage', function () {
      billsService.data.rows = [{id: 106, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-15', dueDt: '2017-06-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-05-15 #106'}, {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, {id: 97, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-02-04T10:27:49-06:00', billDt: '2017-03-03', dueDt: '2017-03-28', closed: true, amount: 0, balance: 0, payments: [], name: 'Blue Cash Amex : 2017-03-03 #97'}];

      billsService.data.pgData.rows = null;
      billsService.data.currPageNo = 1;
      billsService.loadCurrentPage();
      expect(billsService.data.pgData.rows.length).to.equal(2);

      billsService.data.pgData.rows = null;
      billsService.data.currPageNo = 2;
      billsService.loadCurrentPage();
      expect(billsService.data.pgData.rows.length).to.equal(1);
    });
    it('should buildRowsForTab - CLOSED', function () {
      billsService.data.openBills = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      billsService.data.closedBills = [{id: 106, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-15', dueDt: '2017-06-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-05-15 #106'}, {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, {id: 97, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-02-04T10:27:49-06:00', billDt: '2017-03-03', dueDt: '2017-03-28', closed: true, amount: 0, balance: 0, payments: [], name: 'Blue Cash Amex : 2017-03-03 #97'}];
      billsService.data.tab = 'CLOSED';
      billsService.data.pgData.rows = null;
      billsService.data.loading = true;

      billsService.buildRowsForTab();

      expect(billsService.data.rows).to.equal(billsService.data.closedBills);
      expect(billsService.data.maxPageNo).to.equal(2);
      expect(billsService.data.currPageSet).to.equal(0);
      expect(billsService.data.currPageNo).to.equal(0);
      expect(billsService.data.pgData.rows).to.be.not.null;
      expect(billsService.data.loading).to.be.false;
    });
    it('should buildRowsForTab - OPEN', function () {
      billsService.data.openBills = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      billsService.data.closedBills = [{id: 106, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-15', dueDt: '2017-06-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-05-15 #106'}, {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, {id: 97, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-02-04T10:27:49-06:00', billDt: '2017-03-03', dueDt: '2017-03-28', closed: true, amount: 0, balance: 0, payments: [], name: 'Blue Cash Amex : 2017-03-03 #97'}];
      billsService.data.tab = 'OPEN';
      billsService.data.pgData.rows = null;
      billsService.data.loading = true;

      billsService.buildRowsForTab();

      expect(billsService.data.rows).to.equal(billsService.data.openBills);
      expect(billsService.data.maxPageNo).to.equal(0);
      expect(billsService.data.currPageSet).to.equal(0);
      expect(billsService.data.currPageNo).to.equal(0);
      expect(billsService.data.pgData.rows).to.be.not.null;
      expect(billsService.data.loading).to.be.false;
    });
    it('should loadBill', function () {
      const dt = {code: 0, data: {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 33.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}};

      billsService.data.rows = [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}];
      billsService.data.pgData.rows = null;
      billsService.data.loading = true;
      billsService.data.currPageNo = 0;
      billsService.loadBill(dt);

      const bill = billsService.data.rows[_.findIndex(billsService.data.rows, ['id', 85])];

      expect(bill).to.have.property('balance', dt.data.balance);
      expect(billsService.data.pgData.rows).to.be.not.null;
      expect(billsService.data.loading).to.be.false;
    });
    afterEach('rollback mocks', function () {});
  });
  // case #2
  describe('Execute loadBills', function () {
    let billsService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billsService_, _etmenuService_, _ajaxService_) {
        billsService = _billsService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should loadBills - no account, OPEN', function () {
      sinon.spy(ajaxService, 'query');

      expect(billsService.data.loading).to.be.false;
      expect(billsService.data.filterApplied).to.be.false;
      billsService.data.tab = 'OPEN';
      etmenuService.data.menu.city = {id: 20140301};
      const input = {cityId: 20140301, paidInd: 'N'};

      billsService.loadBills();

      expect(billsService.data.loading).to.be.true;
      expect(billsService.data.filterApplied).to.be.false;
      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', input)).to.be.true;
    });
    it('should loadBills - no account, CLOSED', function () {
      sinon.spy(ajaxService, 'query');

      expect(billsService.data.loading).to.be.false;
      expect(billsService.data.filterApplied).to.be.false;
      billsService.data.tab = 'CLOSED';
      etmenuService.data.menu.city = {id: 20140301};
      const input = {cityId: 20140301, paidInd: 'Y'};

      billsService.loadBills();

      expect(billsService.data.loading).to.be.true;
      expect(billsService.data.filterApplied).to.be.false;
      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', input)).to.be.true;
    });
    it('should loadBills - account, OPEN', function () {
      sinon.spy(ajaxService, 'query');

      expect(billsService.data.loading).to.be.false;
      expect(billsService.data.filterApplied).to.be.false;
      billsService.data.tab = 'OPEN';
      etmenuService.data.menu.city = {id: 20140301};
      const input = {cityId: 20140301, paidInd: 'N', acctId: 60};

      billsService.loadBills(60);

      expect(billsService.data.loading).to.be.true;
      expect(billsService.data.filterApplied).to.be.true;
      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', input)).to.be.true;
    });
    it('should loadBills - no account, CLOSED', function () {
      sinon.spy(ajaxService, 'query');

      expect(billsService.data.loading).to.be.false;
      expect(billsService.data.filterApplied).to.be.false;
      billsService.data.tab = 'CLOSED';
      etmenuService.data.menu.city = {id: 20140301};
      const input = {cityId: 20140301, paidInd: 'Y', acctId: 60};

      billsService.loadBills(60);

      expect(billsService.data.loading).to.be.true;
      expect(billsService.data.filterApplied).to.be.true;
      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/dashboard/bills', input)).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.query.restore();
    });
  });
  // case #2
  describe('Execute loadBills - make ajax call', function () {
    let $httpBackend = null;
    let billsService = null;
    let etmenuService = null;
    let dashboardService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_billsService_, _etmenuService_, _dashboardService_) {
        billsService = _billsService_;
        etmenuService = _etmenuService_;
        dashboardService = _dashboardService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it('should execute loadBills, call ajax & load data - OPEN.', function () {
      $httpBackend.expectGET('./dashboard/bills?cityId=20140301&paidInd=N');
      $httpBackend.when('GET', './dashboard/bills?cityId=20140301&paidInd=N').respond({code: 0, data: [{id: 100, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-03-01T13:10:01-06:00', billDt: '2017-03-22', dueDt: '2017-04-19', closed: true, amount: 203.26, balance: 123.14, payments: [{id: 8571, transDt: '2017-04-12', amount: 50}, {id: 8572, transDt: '2017-04-13', amount: 10}, {id: 8947, transDt: '2017-06-05', amount: 20.12}], name: 'Chase Freedom : 2017-03-22 #100', $$hashKey: 'object:339'}, {id: 85, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2016-11-28T08:12:02-06:00', billDt: '2016-12-24', dueDt: '2017-01-21', closed: true, amount: 2301.82, balance: 43.28, payments: [{id: 8430, transDt: '2017-01-19', amount: 2258.54}], name: 'BOA Visa : 2016-12-24 #85'}]});

      etmenuService.data.menu.city = {id: 20140301};
      billsService.data.tab = 'OPEN';
      billsService.data.loading = false;
      billsService.data.maxPageNo = 0;
      billsService.loadBills();

      expect(billsService.data.loading).to.be.true;
      $httpBackend.flush();
      expect(dashboardService.data.loading.donestep).to.equal(2);
      expect(billsService.data.openBills.length).to.equal(2);
      expect(billsService.data.maxPageNo).to.equal(0);
      expect(billsService.data.loading).to.be.false;
    });
    it('should execute loadBills, call ajax & load data - CLOSED.', function () {
      $httpBackend.expectGET('./dashboard/bills?cityId=20140301&paidInd=Y');
      $httpBackend.when('GET', './dashboard/bills?cityId=20140301&paidInd=Y').respond({code: 0, data: [{id: 106, cityId: 20140301, account: {id: 68, name: 'GAP Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-15', dueDt: '2017-06-08', closed: true, amount: 0, balance: 0, name: 'GAP Visa : 2017-05-15 #106'}, {id: 105, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-05-03', dueDt: '2017-05-28', closed: true, amount: 0, balance: 0, name: 'Blue Cash Amex : 2017-05-03 #105'}, {id: 107, cityId: 20140301, account: {id: 60, name: 'BOA Visa'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-24', dueDt: '2017-05-21', closed: true, amount: 0, balance: 0, name: 'BOA Visa : 2017-04-24 #107'}, {id: 104, cityId: 20140301, account: {id: 83, name: 'Chase Freedom'}, createdDt: '2017-04-17T14:20:45-05:00', billDt: '2017-04-22', dueDt: '2017-05-19', closed: true, amount: 0, balance: 0, name: 'Chase Freedom : 2017-04-22 #104'}, {id: 97, cityId: 20140301, account: {id: 75, name: 'Blue Cash Amex'}, createdDt: '2017-02-04T10:27:49-06:00', billDt: '2017-03-03', dueDt: '2017-03-28', closed: true, amount: 0, balance: 0, payments: [], name: 'Blue Cash Amex : 2017-03-03 #97'}]});

      etmenuService.data.menu.city = {id: 20140301};
      billsService.data.tab = 'CLOSED';
      billsService.data.loading = false;
      billsService.data.maxPageNo = 0;
      billsService.loadBills();

      expect(billsService.data.loading).to.be.true;
      $httpBackend.flush();
      expect(dashboardService.data.loading.donestep).to.equal(2);
      expect(billsService.data.closedBills.length).to.equal(5);
      expect(billsService.data.maxPageNo).to.equal(2);
      expect(billsService.data.loading).to.be.false;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  after('do nothing', function () {});
});
