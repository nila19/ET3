/* global sinon, inject, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('chart.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute renderChart', function () {
    let chartService = null;
    let etmenuService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_chartService_, _etmenuService_, _ajaxService_) {
        chartService = _chartService_;
        etmenuService = _etmenuService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should do nothing - loaded=true', function () {
      sinon.spy(ajaxService, 'get');

      chartService.data.loaded = true;
      chartService.renderChart();

      expect(ajaxService.get.calledOnce).to.be.false;
    });
    it('should do call ajax - loaded=false', function () {
      sinon.spy(ajaxService, 'get');

      etmenuService.data.menu.city = {id: 20140301};
      chartService.data.loaded = false;
      chartService.renderChart();

      expect(ajaxService.get.calledOnce).to.be.true;
      expect(ajaxService.get.calledWith('/summary/chart', {cityId: 20140301})).to.be.true;
    });
    afterEach('rollback mocks', function () {
      ajaxService.get.restore();
    });
  });
  // case #1
  describe('Execute renderChart - make ajax call', function () {
    let $httpBackend = null;
    let chartService = null;
    let etmenuService = null;
    let dashboardService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_chartService_, _etmenuService_, _dashboardService_) {
        chartService = _chartService_;
        etmenuService = _etmenuService_;
        dashboardService = _dashboardService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expectGET('./summary/chart?cityId=20140301');
      $httpBackend.when('GET', './summary/chart?cityId=20140301').respond({code: 0, data: {labels: ['Jun-17', 'May-17', 'Apr-17', 'Mar-17', 'Feb-17', 'Jan-17', 'Dec-16', 'Nov-16', 'Oct-16', 'Sep-16', 'Aug-16', 'Jul-16', 'Jun-16', 'May-16', 'Apr-16', 'Mar-16', 'Feb-16', 'Jan-16', 'Dec-15', 'Nov-15', 'Oct-15', 'Sep-15', 'Aug-15', 'Jul-15', 'Jun-15', 'May-15', 'Apr-15', 'Mar-15', 'Feb-15', 'Jan-15', 'Dec-14', 'Nov-14', 'Oct-14', 'Sep-14', 'Aug-14', 'Jul-14', 'Jun-14', 'May-14', 'Apr-14', 'Mar-14'], regulars: [10, 401, 105.8, 1598.18, 1922.2, 1798.29, 1951.15, 1786.46, 1907.5, 1878.11, 2001.22, 1639.87, 1320.52, 1649.38, 1936.78, 2112.92, 1918.19, 2053.95, 2195.68, 2627.95, 1853.55, 1911.53, 1852.42, 2037.98, 1981.74, 1901.83, 1896.71, 2058.1, 1736.28, 1691.96, 1842.57, 1884.83, 1852.58, 1947.2, 1925.66, 1635.17, 1747.19, 1622.54, 1776.12, 779.7], adhocs: [25.45, 0, 0, 364.39, 2970.8, 358.19, 1097.1, 4671.81, 366.87, 414.97, 694.34, 332.73, 96.79, 5158.51, 681.81, 1582.73, 784.59, 1356.96, 622.5, 766.4, 1447.55, 1667.14, 921.62, 1607.07, 709.33, 1905.84, 4834.67, 2248.66, 566.15, 626.05, 857.75, 1384.88, 1237.04, 639.47, 1515.62, 1290.64, 1045.85, 686.44, 3475.76, 840.37], totals: [35.45, 401, 105.8, 1962.57, 4893, 2156.48, 3048.25, 6458.27, 2274.37, 2293.08, 2695.56, 1972.6, 1417.31, 6807.89, 2618.59, 3695.65, 2702.78, 3410.91, 2818.18, 3394.35, 3301.1, 3578.67, 2774.04, 3645.05, 2691.07, 3807.67, 6731.38, 4306.76, 2302.43, 2318.01, 2700.32, 3269.71, 3089.62, 2586.67, 3441.28, 2925.81, 2793.04, 2308.98, 5251.88, 1620.07]}});
    }));
    it('should execute loadAllAccounts, call ajax & load data.', function () {
      etmenuService.data.menu.city = {id: 20140301};
      chartService.data.loaded = false;

      expect(chartService.data.labels).to.be.empty;
      expect(chartService.data.series).to.be.empty;
      expect(chartService.data.data).to.be.empty;
      expect(chartService.data.options).to.be.empty;
      expect(chartService.data.ds).to.be.empty;

      chartService.renderChart();
      $httpBackend.flush();

      expect(chartService.data.labels).to.be.not.empty;
      expect(chartService.data.series.length).to.equal(3);
      expect(chartService.data.data.length).to.equal(3);
      expect(chartService.data.options).to.be.not.empty;
      expect(chartService.data.ds).to.be.not.empty;
      expect(chartService.data.loaded).to.be.true;
      expect(dashboardService.data.loading.donestep).to.equal(4);
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  after('do nothing', function () {});
});
