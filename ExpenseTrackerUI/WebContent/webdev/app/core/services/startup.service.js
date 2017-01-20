/** ** ./core/services/startup.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('startupService', startupService);

	startupService.$inject = ['ajaxService', 'etmenuService', 'CONSTANTS', 'VALUES', '$resource'];
	function startupService(aj, ms, C, V, $resource) {
		var loaded = false;
		return {
			loadCity: loadCity,
			loadAll: loadAll
		};

		function loadCity() {
			if (!loaded) {
				ms.data.loading = true;
				console.log('@ StartupService: Loading init app components...');
				getDefaultCity();
				loaded = true;
			}
		}
		function loadAll() {
			ms.data.loading = true;
			console.log('@ StartupService: Loading other items...');
			getCategories(V.data.city);
		}

		function getAllCities() {
			aj.query('/startup/cities', {}, loadCities);
		}
		function getDefaultCity() {
			aj.get('/startup/city/default', {}, loadDefaultCity);
		}
		function getCategories(city) {
			aj.query('/startup/categories', {
				city: city.id
			}, loadCategories);
		}
		function getDescriptions(city) {
			aj.query('/startup/descriptions', {
				city: city.id
			}, loadDescriptions);
		}
		function getAccounts(city) {
			aj.query('/startup/accounts', {
				city: city.id
			}, loadAccounts);
		}
		function getTransMonths(city) {
			aj.query('/startup/months/trans', {
				city: city.id
			}, loadTransMonths);
		}
		function getEntryMonths(city) {
			aj.query('/startup/months/entry', {
				city: city.id
			}, loadEntryMonths);
		}

		function loadDefaultCity(city) {
			V.data.city = city.toJSON();

			getAllCities();
		}
		function loadCities(cities) {
			V.data.cities = [];
			angular.forEach(cities, function(city) {
				V.data.cities.push(city.toJSON());
			});

			getCategories(V.data.city);
		}
		function loadCategories(categories) {
			V.data.categories = [];
			angular.forEach(categories, function(category) {
				V.data.categories.push(category.toJSON());
			});

			getDescriptions(V.data.city);
		}
		function loadDescriptions(descriptions) {
			V.data.descriptions = [];
			angular.forEach(descriptions, function(description) {
				V.data.descriptions.push(description);
			});

			getAccounts(V.data.city);
		}
		function loadAccounts(accounts) {
			V.data.accounts = [];
			angular.forEach(accounts, function(account) {
				V.data.accounts.push(account.toJSON());
			});

			getTransMonths(V.data.city);
		}
		function loadTransMonths(transMonths) {
			V.data.transMonths = [];
			angular.forEach(transMonths, function(transMonth) {
				V.data.transMonths.push(transMonth.toJSON());
			});

			getEntryMonths(V.data.city);
		}
		function loadEntryMonths(entryMonths) {
			V.data.entryMonths = [];
			angular.forEach(entryMonths, function(entryMonth) {
				V.data.entryMonths.push(entryMonth.toJSON());
			});
			console.log('@ StartupService: Loading init app components COMPLETED...');
			ms.data.loading = false;
		}

		/** **************** Test Methods ****************** */
		function testAjax() {
			// get();
			getAll();
		}

		function add() {
			var parm = {
				login: 'User_2',
				email: 'google',
				age: 15
			};
			$resource(C.BASE_URL + '/users/add').save(parm, function(user) {
				console.log('add -> Out from WS.. = ' + JSON.stringify(user.toJSON()));
			});
		}

		function remove() {
			var parm = {
				login: 'User_2',
				email: 'google',
				age: 15
			};
			$resource(C.BASE_URL + '/users/delete').save(parm, function(user) {
				console.log('remove -> Out from WS.. = ' + JSON.stringify(user.toJSON()));
			});
		}

		function get() {
			var parm = {
				age: 5
			};
			var id = 'User_2';
			$resource(C.BASE_URL + '/users/get/' + id).get(parm, function(user) {
				console.log('get -> Out from WS.. = ' + JSON.stringify(user.toJSON()));
			});
		}

		function getAll() {
			var parm = {
				id: 'User_2',
				age: 5
			};
			$resource(C.BASE_URL + '/users/get').query(parm, function(users) {
				angular.forEach(users, function(user) {
					console.log('getAll -> Out from WS.. = ' + JSON.stringify(user.toJSON()));
				});
			});
		}
	}

})(window.angular);
