/* global sinon, inject, assert, expect*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe('startup.service', function () {
  before('do nothing', function () {});
  // case #0
  describe('Execute loadAll', function () {
    let startupService = null;
    let ajaxService = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_startupService_, _ajaxService_) {
        startupService = _startupService_;
        ajaxService = _ajaxService_;
      });
    });
    it('should set flags & call ajax', function () {
      sinon.spy(ajaxService, 'get');

      startupService.loadAll();
      assert(ajaxService.get.calledOnce);
      assert(ajaxService.get.calledWith('/startup/connect'));
      expect(startupService.data.loadInitiated).to.be.true;

      // called second time
      startupService.loadAll();
      expect(ajaxService.get.callCount).to.equal(1);
    });
    afterEach('rollback mocks', function () {
      ajaxService.get.restore();
    });
  });
  // case #1
  describe('Execute loadAll with $httpBackend', function () {
    let startupService = null;
    let $httpBackend = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_startupService_) {
        startupService = _startupService_;
      });
    });
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', './startup/connect').respond({code: 0, data: {env: 'DEV'}});
      $httpBackend.when('GET', './startup/city/default').respond({code: 0, data: {id: 20140301, name: 'Houston', active: true, default: true, currency: 'USD', startDt: '2014-03-01', endDt: '2020-01-01'}});
      $httpBackend.when('GET', './startup/cities').respond({code: 0, data: [{id: 20140301, name: 'Houston', active: true, default: true, currency: 'USD', startDt: '2014-03-01', endDt: '2020-01-01'}]});
      $httpBackend.when('GET', './startup/categories?cityId=20140301').respond({code: 0, data: [{id: 170, name: 'House ~ Rent', cityId: 20140301, mainDesc: 'House', subDesc: 'Rent', icon: 'home', active: true, seq: 11, bills: null}]});
      $httpBackend.when('GET', './startup/descriptions?cityId=20140301').respond({code: 0, data: [{name: 'Kroger', bills: null}, {name: 'CC Bill Payment', bills: null}, {name: 'Salary', bills: null}, {name: 'Costco', bills: null}]});
      $httpBackend.when('GET', './startup/accounts/thin?cityId=20140301').respond({code: 0, data: [{id: 62, name: 'BOA - 7787', cash: true, active: true, billed: false, bills: null}, {id: 80, name: 'Chase Checking', cash: true, active: true, billed: false, bills: null}]});
      $httpBackend.when('GET', './startup/months/trans?cityId=20140301').respond({code: 0, data: [{id: '2017-12-31', bills: null, aggregate: true, name: '2017', seq: 201713, year: 2017}, {id: '2017-06-01', bills: null, aggregate: false, name: 'Jun-17', seq: 201706, year: 2017}]});
      $httpBackend.when('GET', './startup/months/entry?cityId=20140301').respond({code: 0, data: [{id: '2017-12-31', bills: null, aggregate: true, name: '2017', seq: 201713, year: 2017}, {id: '2017-06-01', bills: null, aggregate: false, name: 'Jun-17', seq: 201706, year: 2017}]});
    }));
    it('should make all ajax calls to fetch startup data', function () {
      $httpBackend.expectGET('./startup/connect');
      $httpBackend.expectGET('./startup/city/default');
      $httpBackend.expectGET('./startup/cities');
      $httpBackend.expectGET('./startup/categories?cityId=20140301');
      $httpBackend.expectGET('./startup/descriptions?cityId=20140301');
      $httpBackend.expectGET('./startup/accounts/thin?cityId=20140301');
      $httpBackend.expectGET('./startup/months/trans?cityId=20140301');
      $httpBackend.expectGET('./startup/months/entry?cityId=20140301');
      startupService.loadAll();
      $httpBackend.flush();
      expect(startupService.data.connect).to.be.true;
      expect(startupService.data.status).to.equal(80);
    });
    afterEach('rollback mocks', function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
  // case #2
  describe.skip('Execute loadAll with spy - Sinon FakeServer **Does not work', function () {
    let startupService = null;
    let server = null;

    beforeEach('prepare app', function () {
      server = sinon.fakeServer.create();
      module('app');
      inject(function (_startupService_) {
        startupService = _startupService_;
      });
    });
    it('should make a call to loadConnect cb with data', function () {
      server.respondWith('GET', '/startup/connect', [200, {'Content-Type': 'application/json'},
        '[{"code":0,"data":{"env":"DEV"}}]'
      ]);
      const cb = sinon.spy();

      startupService.loadAll(cb);
      server.respond();

      assert(server.requests.length > 0);
      assert(cb.called);
    });
    afterEach('rollback mocks', function () {
      server.restore();
    });
  });
  // case #3
  describe.skip('startup.controller **Does not work', function () {
    let $controller = null;
    let $location = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_$controller_, _$location_) {
        $controller = _$controller_;
        $location = _$location_;
      });
    });
    it('should make all ajax calls to fetch startup data', function () {
      const path = sinon.spy($location, 'path');
      const $scope = {};
      const startupController = $controller('startup', {$scope: $scope});

      startupController.init();
      assert(path.calledOnce);
      assert(path.calledWith('/dashboard'));
    });
    afterEach('rollback mocks', function () {
      $location.path.restore();
    });
  });
  // case #4
  describe.skip('startup.controller **Does not work', function () {
    let startupController = null;
    let $location = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_startup_, _$location_) {
        startupController = _startup_;
        $location = _$location_;
      });
    });
    it('should make all ajax calls to fetch startup data', function () {
      const path = sinon.spy($location, 'path');

      startupController.init();
      assert(path.calledOnce);
      assert(path.calledWith('/dashboard'));
    });
    afterEach('rollback mocks', function () {
      $location.path.restore();
    });
  });
  after('do nothing', function () {});
});
