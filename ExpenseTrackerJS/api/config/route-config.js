'use strict';

const error = require('../routes/error-route');
const startup = require('../routes/startup-route');
const search = require('../routes/search-route');
const summary = require('../routes/summary-route');
const edit = require('../routes/edit-route');
const dashboard = require('../routes/dashboard-route');

module.exports = {
  route: function (app) {
    app.use('/startup', startup);
    app.use('/search', search);
    app.use('/summary', summary);
    app.use('/edit', edit);
    app.use('/dashboard', dashboard);

    // catch 404 and forward to error handler
    app.use(error.inject404());
    app.use(error.handler());
  }
};
