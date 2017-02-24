'use strict';

const index = require('../routes/index-route');
const users = require('../routes/users-route');
const login = require('../routes/login-route');
const error = require('../routes/error-route');

module.exports = {
  route: function (app) {
    app.use('/', index);
    app.use('/users', users);
    app.use('/access', login);

    // catch 404 and forward to error handler
    app.use(error.inject404());
    app.use(error.handler());
  }
};
