/** ** ./startup/startup.service.js *** */
/* eslint no-console: "off" */

(function (angular) {
  'use strict';

  const startupService = function (ms, aj, C, V, $timeout) {
    const data = {
      status: 0,
      connect: false,
      loadInitiated: false
    };
    const TEN = 10;
    const TOTAL = 80;
    const WAIT = 100; // milliseconds

    const checkLoadingComplete = function () {
      if (data.status >= TOTAL) {
        // console.log('@ StartupService: Loading startup components COMPLETED...');
        ms.data.loading = false;
      } else {
        $timeout(function () {
          checkLoadingComplete();
        }, WAIT);
      }
    };
    const loadEntryMonths = function (dt) {
      V.data.entryMonths = [];
      angular.forEach(dt.data, function (entryMonth) {
        V.data.entryMonths.push(entryMonth);
      });
      data.status += TEN;
    };
    const getEntryMonths = function (city) {
      aj.query('/startup/months/entry', {cityId: city.id}, loadEntryMonths);
    };
    const loadTransMonths = function (dt) {
      V.data.transMonths = [];
      angular.forEach(dt.data, function (transMonth) {
        V.data.transMonths.push(transMonth);
      });
      data.status += TEN;
    };
    const getTransMonths = function (city) {
      aj.query('/startup/months/trans', {cityId: city.id}, loadTransMonths);
    };
    const loadAccounts = function (dt) {
      V.data.accounts = dt.data;
      data.status += TEN;
    };
    const getAccounts = function (city) {
      aj.query('/startup/accounts/thin', {cityId: city.id}, loadAccounts);
    };
    const loadDescriptions = function (dt) {
      V.data.descriptions = dt.data;
      data.status += TEN;
    };
    const getDescriptions = function (city) {
      aj.query('/startup/descriptions', {cityId: city.id}, loadDescriptions);
    };
    const loadCategories = function (dt) {
      V.data.categories = dt.data;
      data.status += TEN;
    };
    const getCategories = function (city) {
      aj.query('/startup/categories', {cityId: city.id}, loadCategories);
    };
    const loadCities = function (dt) {
      V.data.cities = dt.data;
      data.status += TEN;
    };
    const getCities = function () {
      aj.query('/startup/cities', {}, loadCities);
    };
    const loadDefaultCity = function (dt) {
      V.data.city = dt.data;
      data.status += TEN;
      loadAllForCity();
    };
    const getDefaultCity = function () {
      aj.get('/startup/city/default', {}, loadDefaultCity);
    };
    const loadConnect = function (dt) {
      data.connect = (dt.code === 0);
      if (data.connect) {
        V.data.env = dt.data.env;
        data.status += TEN;
        getDefaultCity();
        getCities();
      }
    };
    const connect = function (cb) {
      aj.get('/startup/connect', {}, cb);
    };
    const loadAll = function (cb = loadConnect) {
      if (!data.loadInitiated) {
        ms.data.loading = true;
        data.loadInitiated = true;
        // console.log('@ StartupService: Loading startup components...');
        connect(cb);
      }
    };
    const loadAllForCity = function () {
      getCategories(V.data.city);
      getDescriptions(V.data.city);
      getAccounts(V.data.city);
      getTransMonths(V.data.city);
      getEntryMonths(V.data.city);
      checkLoadingComplete();
    };
    const loadOthers = function () {
      ms.data.loading = true;
      // console.log('@ StartupService: Loading items on city change...');
      loadAllForCity();
    };

    return {
      data: data,
      loadAll: loadAll,
      loadOthers: loadOthers
    };
  };

  angular.module('startup').factory('startupService', startupService);
  startupService.$inject = ['etmenuService', 'ajaxService', 'CONSTANTS', 'VALUES', '$timeout'];
})(window.angular);
