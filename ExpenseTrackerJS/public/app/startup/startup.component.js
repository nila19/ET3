/** ** ./startup/startup.component.js *** */

(function (angular) {
  'use strict';

  const StartupController = function (sus, ms, C, V, $location, $timeout) {
    const vm = this;
    const WAIT = 500; // milliseconds

		// ***** function declarations *****//
    const init = function () {
      vm.data = sus.data;
      sus.loadAll();
      checkLoadComplete();
    };
    const checkLoadComplete = function () {
      if (!V.data.city.id || ms.data.loading) {
        console.log(new Date() +' :: Load not done...');
        $timeout(function () {
          checkLoadComplete();
        }, WAIT);
      } else {
        $location.path('/dashboard');
      }
    };

    init();
  };

  angular.module('startup').component('startup', {
    templateUrl: 'startup/startup.htm',
    controller: StartupController
  });
  StartupController.$inject = ['startupService', 'etmenuService', 'CONSTANTS', 'VALUES',
    '$location', '$timeout'];
})(window.angular);
