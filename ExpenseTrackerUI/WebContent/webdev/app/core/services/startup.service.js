/** ** ./core/services/startup.service.js *** */

(function(angular) {
	'use strict';

	angular.module('core.services').factory('startupService', startupService);

	startupService.$inject = ['ajaxService', 'CONSTANTS', 'VALUES', '$resource'];
	function startupService(aj, C, V, $resource) {
		var loaded = false;
		return {
			loadAll: loadAll,
			getAllCities: getAllCities,
			getDefaultCity: getDefaultCity,
			getCategories: getCategories,
			getDescriptions: getDescriptions,
			getAccounts: getAccounts,
			getMonths: getMonths
		};

		function loadAll() {
			if (!loaded) {
				getAllCities();
				getDefaultCity();
				getCategories();
				getDescriptions();
				getAccounts();
				getMonths();
				loaded = true;
			}
		}
		function getAllCities() {
			aj.get('values/cities', {}, loadCities);
		}
		function getDefaultCity() {
			aj.get('values/city', {}, loadDefaultCity);
		}
		function getCategories() {
			aj.get('values/categories', {}, loadCategories);
		}
		function getDescriptions() {
			aj.get('values/descriptions', {}, loadDescriptions);
		}
		function getAccounts() {
			aj.get('values/accounts', {}, loadAccounts);
		}
		function getMonths() {
			aj.get('values/months', {}, loadMonths);
		}

		function loadCities(cities) {
			V.cities = cities.toJSON();
		}
		function loadDefaultCity(city) {
			V.defaultCity = city.toJSON();
		}
		function loadCategories(categories) {
			V.categories = categories.toJSON();
		}
		function loadDescriptions(descriptions) {
			V.descriptions = descriptions.toJSON();
		}
		function loadAccounts(accounts) {
			V.accounts = accounts.toJSON();
		}
		function loadMonths(months) {
			V.months = months.toJSON();
		}

		/** **************** Test Methods ****************** */
		function testAjax() {
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
