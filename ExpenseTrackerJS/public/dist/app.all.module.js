/** ** ./app.module.js *** */

(function (angular) {
  'use strict';

  angular.module('app', ['core', 'dashboard', 'etmenu', 'search', 'summary', 'core.directives', 'ngRoute']);
  angular.module('app').config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(true);
  }]);
})(window.angular);

/** ** ./core/core.module.js *** */

(function (angular) {
  'use strict';

  angular.module('core', ['core.directives', 'core.filters', 'core.services']);
})(window.angular);

/** ** ./dashboard/dashboard.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard', ['core', 'etmenu', 'dashboard.accounts', 'dashboard.add',
    'dashboard.bills', 'dashboard.billpay', 'dashboard.chart', 'dashboard.edit',
    'dashboard.explist']);
})(window.angular);

/** ** ./etmenu/etmenu.module.js *** */

(function (angular) {
  'use strict';

  angular.module('etmenu', ['core', 'startup', 'ngRoute']);
})(window.angular);

/** ** ./search/search.module.js *** */

(function (angular) {
  'use strict';

  angular.module('search', ['etmenu', 'core', 'core.directives', 'core.services',
    'dashboard.explist', 'dashboard.edit', 'ngRoute', 'ngAnimate', 'ui.bootstrap',
    'ui.bootstrap.typeahead']);
})(window.angular);

/** ** ./startup/startup.module.js *** */

(function (angular) {
  'use strict';

  angular.module('startup', ['core', 'etmenu', 'dashboard.accounts', 'ui.bootstrap']);
})(window.angular);

/** ** ./summary/summary.module.js *** */

(function (angular) {
  'use strict';

  angular.module('summary', ['core', 'etmenu', 'ui.bootstrap']);
})(window.angular);

/** ** ./core/directives/directives.module.js *** */

(function (angular) {
  'use strict';

  angular.module('core.directives', ['core']);
})(window.angular);

/** ** ./core/filters/filters.module.js *** */

(function (angular) {
  'use strict';

  angular.module('core.filters', ['core']);
})(window.angular);

/** ** ./core/services/services.module.js *** */

(function (angular) {
  'use strict';

  angular.module('core.services', ['core', 'ngResource']);
})(window.angular);

/** ** ./dashboard/accounts/accounts.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.accounts', ['core', 'dashboard.bills', 'dashboard.explist']);
})(window.angular);

/** ** ./dashboard/add/add.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.add',	['core', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.typeahead']);
})(window.angular);

/** ** ./dashboard/billpay/billpay.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.billpay', ['core', 'ngAnimate', 'ui.bootstrap',
    'ui.bootstrap.typeahead']);
})(window.angular);

/** ** ./dashboard/bills/bills.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.bills', ['core', 'dashboard.explist', 'dashboard.billpay']);
})(window.angular);

/** ** ./dashboard/chart/chart.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.chart', ['core', 'chart.js']);
})(window.angular);

/** ** ./dashboard/edit/edit.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.edit', ['core', 'core.directives', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.typeahead']);
})(window.angular);

/** ** ./dashboard/explist/explist.module.js *** */

(function (angular) {
  'use strict';

  angular.module('dashboard.explist', ['core', 'dashboard.edit']);
})(window.angular);
