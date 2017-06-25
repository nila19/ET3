/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('accounts.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute loadAllAccounts - call ajax', function () {
    let accountsService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _etmenuService_, _ajaxService_) {
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should loadAllAccounts', function () {
      sinon.spy(ajaxService, 'query');

      etmenuService.data.menu.city = {id: 20140301};
      accountsService.loadAllAccounts();

      expect(ajaxService.query.calledOnce).to.be.true;
      expect(ajaxService.query.calledWith('/startup/accounts')).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.query.restore();
    });
  });
  // case #1
  describe('Execute loadPage - make ajax call', function () {
    let $httpBackend = null;
    let accountsService = null;
    let etmenuService = null;
    let dashboardService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _etmenuService_, _dashboardService_) {
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
        dashboardService = _dashboardService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectGET('./startup/accounts?cityId=20140301');
    }));
    it('should execute loadAllAccounts, call ajax & load data.', function () {
      $httpBackend.when('GET', './startup/accounts?cityId=20140301').respond({code: 0, data: [{id: 62, cityId: 20140301, name: 'BOA - 7787', balance: 11399.68, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 1, tallyBalance: 15807.95, tallyDt: '2017-03-13T09:56:03-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 4043.0699999999997, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 4043.0699999999997, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}]});

      etmenuService.data.menu.city = {id: 20140301};
      expect(accountsService.data.accts).to.be.null;
      expect(accountsService.data.maxRows).to.equal(0);
      expect(dashboardService.data.loading.donestep).to.equal(0);

      accountsService.loadAllAccounts();
      $httpBackend.flush();

      expect(accountsService.data.accts).to.be.not.null;
      expect(accountsService.data.maxRows).to.equal(1);
      expect(dashboardService.data.loading.donestep).to.equal(1);
    });
    it('should execute loadAllAccounts, call ajax & load data; 2 rows', function () {
      $httpBackend.when('GET', './startup/accounts?cityId=20140301').respond({code: 0, data: [{id: 62, cityId: 20140301, name: 'BOA - 7787', balance: 11399.68, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 1, tallyBalance: 15807.95, tallyDt: '2017-03-13T09:56:03-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 4043.0699999999997, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 4043.0699999999997, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 63, cityId: 20140301, name: 'Cash - Bala', balance: 84.72, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 20, tallyBalance: 84.72, tallyDt: '2017-03-08T09:37:17-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 64, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 73, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 74, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 75, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}]});

      etmenuService.data.menu.city = {id: 20140301};
      expect(accountsService.data.accts).to.be.null;
      expect(accountsService.data.maxRows).to.equal(0);
      expect(dashboardService.data.loading.donestep).to.equal(0);

      accountsService.loadAllAccounts();
      $httpBackend.flush();

      expect(accountsService.data.accts).to.be.not.null;
      expect(accountsService.data.maxRows).to.equal(2);
      expect(dashboardService.data.loading.donestep).to.equal(1);
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  // case #2
  describe('Execute loadAccount', function () {
    let accountsService = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _etmenuService_) {
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should execute loadAccounts for 1 account', function () {
      accountsService.data.accts = [{id: 62, cityId: 20140301, name: 'BOA - 7787', balance: 11399.68, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 1, tallyBalance: 15807.95, tallyDt: '2017-03-13T09:56:03-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 4043.0699999999997, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 4043.0699999999997, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}, {id: 63, cityId: 20140301, name: 'Cash - Bala', balance: 84.72, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 20, tallyBalance: 84.72, tallyDt: '2017-03-08T09:37:17-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 64, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 73, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 74, cityId: 20140301, name: 'Cash - Anitha', balance: 30.39, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 21, tallyBalance: 30.39, tallyDt: '2017-01-29T21:29:04-06:00', closingDay: 0, dueDay: 0, bills: null}, {id: 75, cityId: 20140301, name: 'HSA', balance: 805.14, cash: true, active: true, billed: false, icon: 'attach_money', color: 'green', seq: 22, tallyBalance: 805.14, tallyDt: '2017-03-08T09:40:51-06:00', closingDay: 0, dueDay: 0, bills: null}];
      accountsService.data.maxRows = 2;
      etmenuService.data.loading = true;

      const data = {code: 0, data: {id: 80, cityId: 20140301, name: 'Chase Checking', balance: 5000, cash: true, active: true, billed: false, icon: 'account_balance', color: 'blue', seq: 2, tallyBalance: 5000, tallyDt: '2017-04-11T21:24:22-05:00', closingDay: 0, dueDay: 0, bills: null}};

      accountsService.loadAccount(data);

      const idx = _.findIndex(accountsService.data.accts, ['id', 80]);

      expect(accountsService.data.accts[idx]).to.have.property('balance', 5000);
      expect(accountsService.data.accts[idx]).to.have.property('tallyBalance', 5000);
      expect(etmenuService.data.loading).to.be.false;
    });
    afterEach('rollback mocks', function () {});
  });
  // case #3
  describe('Execute filterAccount', function () {
    let accountsService = null;
    let billsService = null;
    let searchService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _billsService_, _searchService_) {
        accountsService = _accountsService_;
        billsService = _billsService_;
        searchService = _searchService_;
      });
    });
    it('should execute filterAccount', function () {
      sinon.spy(billsService, 'clearBillsList');
      sinon.spy(billsService, 'loadBills');

      searchService.initializeData();
      searchService.data.bill = {id: 50};
      expect(accountsService.data.filterBy).to.be.null;
      expect(searchService.data.account).to.be.null;

      accountsService.filterAccount(80);

      expect(accountsService.data.filterBy).to.equal(80);
      expect(billsService.clearBillsList.calledOnce).to.be.true;
      expect(billsService.loadBills.calledOnce).to.be.true;
      expect(billsService.loadBills.calledWith(80)).to.be.true;
      expect(searchService.data.account.id).to.equal(80);
      expect(searchService.data.bill).to.be.null;
    });
    afterEach('rollback mocks', function () {
      billsService.clearBillsList.restore();
      billsService.loadBills.restore();
    });
  });
  // case #4
  describe('Execute tallyAccount - call ajax', function () {
    let accountsService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _etmenuService_, _ajaxService_) {
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should tallyAccount', function () {
      sinon.spy(ajaxService, 'post');

      etmenuService.data.loading = {id: 20140301};
      accountsService.tallyAccount(80);

      expect(etmenuService.data.loading).to.be.true;
      expect(accountsService.data.tallyOn).to.equal(80);
      expect(ajaxService.post.calledOnce).to.be.true;
      expect(ajaxService.post.calledWith('/edit/tally/80')).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.post.restore();
    });
  });
  // case #5
  describe('Execute tallyAccount - make ajax call', function () {
    let $httpBackend = null;
    let accountsService = null;
    let etmenuService = null;
    let searchService = null;
    let utilsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_accountsService_, _etmenuService_, _searchService_, _utilsService_) {
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
        searchService = _searchService_;
        utilsService = _utilsService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectPOST('./edit/tally/80');
    }));
    it('should execute tallyAccount, call ajax & load data - Success', function () {
      $httpBackend.expectGET('./search/go?thinList=true');
      $httpBackend.when('POST', './edit/tally/80').respond({code: 0});
      $httpBackend.when('GET', './search/go?thinList=true').respond({code: 0, data: [{id: 8441, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 0, name: null}, description: 'ATM Cash', amount: 80, transDt: '2017-01-25', transMonth: '2017-01-01', seq: 8897, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 21879.93, balanceAf: 21799.93}, to: {id: 63, name: 'Cash - Bala', balanceBf: 4.719999999999999, balanceAf: 84.72}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}, {id: 8086, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 175, name: null}, description: 'Costco', amount: 44.84, transDt: '2016-09-18', transMonth: '2016-09-01', seq: 8896, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11299.13, balanceAf: 11343.969999999998}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}, {id: 8344, cityId: 20140301, entryDt: '2017-06-17T18:45:53-05:00', entryMonth: '2017-06-01', category: {id: 181, name: null}, description: 'Costco Returns', amount: -43.28, transDt: '2016-12-03', transMonth: '2016-12-01', seq: 8895, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11257.41, balanceAf: 11214.13}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: true, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}]});
      sinon.spy(searchService, 'doSearch');
      sinon.stub(utilsService, 'showMsg');

      expect(etmenuService.data.loading).to.be.false;
      expect(accountsService.data.tallyOn).to.be.null;

      accountsService.tallyAccount(80);
      expect(etmenuService.data.loading).to.be.true;
      expect(accountsService.data.tallyOn).to.equal(80);
      $httpBackend.flush();

      expect(etmenuService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Tally', 0)).to.be.true;
      expect(searchService.doSearch.calledOnce).to.be.true;
    });
    it('should execute tallyAccount, call ajax & load data - Failure', function () {
      $httpBackend.when('POST', './edit/tally/80').respond({code: 100});
      $httpBackend.when('GET', './search/go?thinList=true').respond({code: 0, data: [{id: 8441, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 0, name: null}, description: 'ATM Cash', amount: 80, transDt: '2017-01-25', transMonth: '2017-01-01', seq: 8897, accounts: {from: {id: 62, name: 'BOA - 7787', balanceBf: 21879.93, balanceAf: 21799.93}, to: {id: 63, name: 'Cash - Bala', balanceBf: 4.719999999999999, balanceAf: 84.72}}, adhoc: false, adjust: true, status: true, tallied: false, tallyDt: null}, {id: 8086, cityId: 20140301, entryDt: '2017-06-17T18:50:49-05:00', entryMonth: '2017-06-01', category: {id: 175, name: null}, description: 'Costco', amount: 44.84, transDt: '2016-09-18', transMonth: '2016-09-01', seq: 8896, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11299.13, balanceAf: 11343.969999999998}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: false, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}, {id: 8344, cityId: 20140301, entryDt: '2017-06-17T18:45:53-05:00', entryMonth: '2017-06-01', category: {id: 181, name: null}, description: 'Costco Returns', amount: -43.28, transDt: '2016-12-03', transMonth: '2016-12-01', seq: 8895, accounts: {from: {id: 60, name: 'BOA Visa', balanceBf: 11257.41, balanceAf: 11214.13}, to: {id: 0, name: '', balanceBf: 0, balanceAf: -121254.83}}, adhoc: true, adjust: false, status: true, tallied: false, tallyDt: null, bill: {id: 108, account: {id: 60, name: 'BOA Visa'}, billDt: '2017-06-24', name: 'BOA Visa : 2017-06-24 #108'}}]});
      sinon.spy(searchService, 'doSearch');
      sinon.stub(utilsService, 'showMsg');

      expect(etmenuService.data.loading).to.be.false;
      expect(accountsService.data.tallyOn).to.be.null;

      accountsService.tallyAccount(80);
      expect(etmenuService.data.loading).to.be.true;
      expect(accountsService.data.tallyOn).to.equal(80);
      $httpBackend.flush();

      expect(etmenuService.data.loading).to.be.false;
      expect(utilsService.showMsg.calledOnce).to.be.true;
      expect(utilsService.showMsg.calledWith('Tally', 100)).to.be.true;
      expect(searchService.doSearch.calledOnce).to.be.false;
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      searchService.doSearch.restore();
      utilsService.showMsg.restore();
    });
  });
  after('do nothing', function () {});
});
