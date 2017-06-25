/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('dashboardflags.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute setFlags', function () {
    let dashboardFlagsService = null;
    let accountsService = null;
    let billsService = null;
    let addService = null;
    let etmenuService = null;
    let chartService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_dashboardFlagsService_, _accountsService_, _billsService_, _addService_, _etmenuService_, _chartService_) {
        dashboardFlagsService = _dashboardFlagsService_;
        accountsService = _accountsService_;
        billsService = _billsService_;
        addService = _addService_;
        etmenuService = _etmenuService_;
        chartService = _chartService_;
      });
    });
    it('should initialize', function () {
      dashboardFlagsService.setFlags();

      expect(accountsService.data.showAcctsRowOne).to.be.true;
      expect(accountsService.data.showAcctsMore).to.be.false;
      expect(billsService.data.showBills).to.be.true;
      expect(addService.data.showAdd).to.be.true;
      expect(chartService.data.showChart).to.be.false;
      expect(etmenuService.data.showingMoreAccounts).to.be.false;
      expect(etmenuService.data.showingChart).to.be.false;
    });
    afterEach('rollback mocks', function () {});
  });
  // case #1
  describe('Execute toggleMoreAccounts', function () {
    let dashboardFlagsService = null;
    let etmenuService = null;
    let accountsService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_dashboardFlagsService_, _accountsService_, _etmenuService_) {
        dashboardFlagsService = _dashboardFlagsService_;
        accountsService = _accountsService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should initialize', function () {
      expect(etmenuService.data.showingMoreAccounts).to.be.false;
      expect(accountsService.data.showAcctsMore).to.be.false;
      dashboardFlagsService.toggleMoreAccounts();

      expect(etmenuService.data.showingMoreAccounts).to.be.true;
      expect(accountsService.data.showAcctsMore).to.be.true;
    });
    afterEach('rollback mocks', function () {});
  });
  // case #2
  describe('Execute toggleChart', function () {
    let dashboardFlagsService = null;
    let addService = null;
    let chartService = null;
    let etmenuService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_dashboardFlagsService_, _addService_, _chartService_, _etmenuService_) {
        dashboardFlagsService = _dashboardFlagsService_;
        addService = _addService_;
        chartService = _chartService_;
        etmenuService = _etmenuService_;
      });
    });
    it('should initialize', function () {
      sinon.spy(chartService, 'renderChart');

      expect(etmenuService.data.showingChart).to.be.false;
      expect(addService.data.showAdd).to.be.false;
      expect(chartService.data.showChart).to.be.false;
      dashboardFlagsService.toggleChart();

      expect(etmenuService.data.showingChart).to.be.true;
      expect(addService.data.showAdd).to.be.true;
      expect(chartService.data.showChart).to.be.true;
      expect(chartService.renderChart.calledOnce).to.be.true;
    });
    afterEach('rollback mocks', function () {
      chartService.renderChart.restore();
    });
  });
  after('do nothing', function () {});
});
