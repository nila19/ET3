/** ** ./core/services/ajax.service.js *** */
/* eslint no-console: "off" */

(function (angular) {
  'use strict';

  const ajaxService = function (us, C, $resource) {
    const url = function (path) {
      const url = C.BASE_URL + path;

      return $resource(url);
    };
    const get = function (path, data, ok) {
      url(path).get(data, ok, error);
    };
    const query = function (path, data, ok) {
      url(path).get(data, ok, error);
      // url(path).query(data, ok, error);
    };
    const post = function (path, data, ok) {
      url(path).save(data, ok, error);
    };
    const error = function (resp) {
      us.show('AJAX Error!!.. ' + resp.status + ' :: ' + resp.statusText, C.MSG.DANGER);
      console.log('AJAX Error!!.. ' + resp.status + ' :: ' + resp.statusText);
    };

    return {
      url: url,
      get: get,
      query: query,
      post: post
    };
  };

  angular.module('core.services').factory('ajaxService', ajaxService);
  ajaxService.$inject = ['utilsService', 'CONSTANTS', '$resource'];
})(window.angular);
