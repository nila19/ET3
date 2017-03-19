'use strict';

const http = require('http');
// monitoring process blockages.
const blocked = require('blocked');

const app = require('./app');
const handler = require('./handler');
const config = require('../config/config');
const server = http.createServer(app);

app.set('port', config.port);
server.listen(config.port);

// pass-through methods since unable to pass port# from event handler.
server.on('error', function (err) {
  handler.onError(err, app);
});
server.on('listening', function () {
  handler.onListening(app);
});

// pings server every 100ms & look for process blockages. Logs if the wait time goes more than the threshold.
if(config.blocked && config.blocked.on) {
  blocked(function (ms) {
    app.locals.log.warn(app.locals.log.chalk.cyan(new Date() + ' :: CPU blocked for %sms', ms || 0));
  }, {threshold: config.blocked.threshold});
}

// bad practice to catch the uncaught exception... process.on('uncaughtException', handler.unCaught);
