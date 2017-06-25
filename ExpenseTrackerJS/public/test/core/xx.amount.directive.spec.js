/* global sinon, inject, assert*/
/* eslint no-console: "off", no-magic-numbers: "off", max-len: "off" */

'use strict';

// ====================== Test Cases ======================//
describe.skip('xxamount.directive', function () {
  before('do nothing', function () {});
  // case #0
  describe('formatter', function () {
    let xxAmount = null;
    let $element = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_xxAmount_, _$element_) {
        xxAmount = _xxAmount_;
        $element = _$element_;
      });
    });
    it('format the amount', function () {
      const stub = sinon.stub($element, 'val');

      stub.returns('123.50');

      xxAmount.link.formatter();
      assert(stub.calledOnce);
      assert(stub.calledWith('$123.50'));
    });
    afterEach('rollback mocks', function () {
      $element.val.restore();
    });
  });
  // case #1
  describe('formatter', function () {
    let $compile = null;
    let $rootScope = null;

    beforeEach('prepare app', function () {
      module('app');
      inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      });
    });
    it('format the amount', function () {
      const stub = sinon.stub();

      stub.returns('123.50');

      const elem = $compile('xx-amount')($rootScope);

      $rootScope.$digest();

      console.log(elem.html());
    });
    afterEach('rollback mocks', function () {});
  });
  after('do nothing', function () {});
});
