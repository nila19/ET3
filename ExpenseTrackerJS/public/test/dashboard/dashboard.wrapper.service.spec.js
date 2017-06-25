/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('dashboardwrapper.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute initialize', function () {
    let dashboardwrapperService = null;
    let explistService = null;
    let searchService = null;
    let addService = null;
    let accountsService = null;
    let billsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_dashboardwrapperService_, _explistService_, _searchService_, _addService_, _accountsService_, _billsService_) {
        dashboardwrapperService = _dashboardwrapperService_;
        explistService = _explistService_;
        searchService = _searchService_;
        addService = _addService_;
        accountsService = _accountsService_;
        billsService = _billsService_;
      });
    });
    it('should initialize', function () {
      sinon.spy(explistService, 'loadCurrentPage');
      sinon.spy(searchService, 'initializeData');
      sinon.spy(addService, 'initializeData');

      dashboardwrapperService.initialize();

      expect(explistService.data.thinList).to.be.true;
      expect(explistService.data.thinListToggle).to.be.false;
      expect(explistService.data.currPageNo).to.equal(0);
      expect(accountsService.data.filterBy).to.be.null;
      expect(billsService.data.filterApplied).to.be.false;
      expect(billsService.data.filterBy).to.be.null;

      expect(explistService.loadCurrentPage.calledOnce).to.be.true;
      expect(searchService.initializeData.calledOnce).to.be.true;
      expect(addService.initializeData.calledOnce).to.be.true;
    });
    afterEach('rollback mocks', function () {
      explistService.loadCurrentPage.restore();
      searchService.initializeData.restore();
      addService.initializeData.restore();
    });
  });
  // case #1
  describe('Execute loadPage', function () {
    let dashboardwrapperService = null;
    let explistwrapperService = null;
    let socketService = null;
    let accountsService = null;
    let billsService = null;
    let dashboardService = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_dashboardwrapperService_, _explistwrapperService_, _socketService_, _accountsService_, _billsService_, _dashboardService_, _etmenuService_) {
        dashboardwrapperService = _dashboardwrapperService_;
        explistwrapperService = _explistwrapperService_;
        socketService = _socketService_;
        accountsService = _accountsService_;
        billsService = _billsService_;
        dashboardService = _dashboardService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should initialize', function () {
      sinon.spy(accountsService, 'loadAllAccounts');
      sinon.spy(billsService, 'loadBills');
      sinon.spy(explistwrapperService, 'reloadExpenses');
      sinon.spy(socketService, 'init');

      expect(dashboardService.data.loading.on).to.be.false;
      expect(dashboardService.data.loading.donestep).to.equal(0);
      dashboardwrapperService.loadPage();

      expect(etmenuService.data.loading).to.be.false;
      expect(dashboardService.data.loading.on).to.be.false;

      expect(accountsService.loadAllAccounts.calledOnce).to.be.true;
      expect(billsService.loadBills.calledOnce).to.be.true;
      expect(explistwrapperService.reloadExpenses.calledOnce).to.be.true;
      expect(socketService.init.calledOnce).to.be.true;
    });
    afterEach('rollback mocks', function () {
      accountsService.loadAllAccounts.restore();
      billsService.loadBills.restore();
      explistwrapperService.reloadExpenses.restore();
      socketService.init.restore();
    });
  });
  after('do nothing', function () {});
});
