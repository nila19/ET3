/** ** ./startup/startup.service.js *** */

(function(angular) {
	'use strict';

	angular.module('startup').factory('startupService', startupService);

	startupService.$inject = ['etmenuService', 'accountsService', 'ajaxService', 'CONSTANTS',
			'VALUES'];
	function startupService(ms, acs, aj, C, V) {
		var data = {
			status: 0,
			connect: false,
			loadInitiated: false
		};

		var loadingComplete = function() {
			console.log('@ StartupService: Loading init app components COMPLETED...');
			ms.data.loading = false;
		};
		var loadEntryMonths = function(entryMonths) {
			V.data.entryMonths = [];
			angular.forEach(entryMonths, function(entryMonth) {
				V.data.entryMonths.push(entryMonth.toJSON());
			});
			data.status += 10;
			loadingComplete();
		};
		var getEntryMonths = function(city) {
			aj.query('/startup/months/entry', {
				city: city.id
			}, loadEntryMonths);
		};
		var loadTransMonths = function(transMonths) {
			V.data.transMonths = [];
			angular.forEach(transMonths, function(transMonth) {
				V.data.transMonths.push(transMonth.toJSON());
			});
			data.status += 10;
			getEntryMonths(V.data.city);
		};
		var getTransMonths = function(city) {
			aj.query('/startup/months/trans', {
				city: city.id
			}, loadTransMonths);
		};
		var loadInactiveAccounts = function(accounts) {
			angular.forEach(accounts, function(ac) {
				V.data.allAccounts.push(ac);
			});
			data.status += 10;
			getTransMonths(V.data.city);
		};
		var getInactiveAccounts = function(city) {
			aj.query('/startup/accounts/inactive', {
				city: city.id
			}, loadInactiveAccounts);
		};
		var loadAccounts = function(accounts) {
			angular.forEach(accounts, function(ac) {
				V.data.accounts.push(ac);
				V.data.allAccounts.push(ac);
			});
			// V.data.accounts = accounts;
			// V.data.allAccounts = accounts;
			// Load to accountService - to preload the accounts row @ dashboard
			acs.loadData(accounts);
			data.status += 10;
			getInactiveAccounts(V.data.city);
		};
		var getAccounts = function(city) {
			aj.query('/startup/accounts', {
				city: city.id
			}, loadAccounts);
		};
		var loadDescriptions = function(descriptions) {
			V.data.descriptions = descriptions;
			data.status += 10;
			getAccounts(V.data.city);
		};
		var getDescriptions = function(city) {
			aj.query('/startup/descriptions', {
				city: city.id
			}, loadDescriptions);
		};
		var loadAllCategories = function(categories) {
			V.data.allCategories = categories;
			data.status += 10;
			getDescriptions(V.data.city);
		};
		var getAllCategories = function(city) {
			aj.query('/startup/categories/all', {
				city: city.id
			}, loadAllCategories);
		};
		var loadCategories = function(categories) {
			V.data.categories = categories;
			data.status += 10;
			getAllCategories(V.data.city);
		};
		var getCategories = function(city) {
			aj.query('/startup/categories', {
				city: city.id
			}, loadCategories);
		};
		var loadCities = function(cities) {
			V.data.cities = cities;
			data.status += 10;
			getCategories(V.data.city);
		};
		var getCities = function() {
			aj.query('/startup/cities', {}, loadCities);
		};
		var loadDefaultCity = function(city) {
			V.data.city = city;
			data.status += 10;
			getCities();
		};
		var getDefaultCity = function() {
			aj.get('/startup/city/default', {}, loadDefaultCity);
		};
		var loadConnect = function(conn) {
			data.connect = conn.flag;
			if (data.connect) {
				data.status += 10;
				getDefaultCity();
			}
		};
		var connect = function() {
			aj.get('/startup/connect', {}, loadConnect);
		};

		var loadAll = function() {
			if (!data.loadInitiated) {
				ms.data.loading = true;
				data.loadInitiated = true;
				console.log('@ StartupService: Loading init app components...');
				connect();
			}
		};
		var loadOthers = function() {
			ms.data.loading = true;
			console.log('@ StartupService: Loading other items...');
			getCategories(V.data.city);
		};

		return {
			data: data,
			loadAll: loadAll,
			loadOthers: loadOthers,
		};
	}

})(window.angular);
