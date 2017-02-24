/* eslint no-process-exit: "off"*/

'use strict';

const onError = function (err, app) {
  if (err.syscall !== 'listen') {
    throw err;
  }
  const bind = 'Port : ' + app.get('port');
  const log = app.locals.log;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      log.error(log.chalk.magenta(bind + ' requires elevated privileges'));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(log.chalk.magenta(bind + ' is already in use'));
      process.exit(1);
      break;
    default:
      throw err;
  }
};

const onListening = function (app) {
  app.locals.log.info('Listening on port : ' + app.get('port'));
};

const unCaught = function (err, app) {
  const log = app.locals.log;

  log.error(log.chalk.magenta('** Uncaught Handler... **'));
  log.error(err.stack);
  log.error(err);
};

// normalize a port into a number, string, or false.
const normalizePort = function (val) {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

module.exports = {
  normalizePort: normalizePort,
  onError: onError,
  onListening: onListening,
  unCaught: unCaught
};
