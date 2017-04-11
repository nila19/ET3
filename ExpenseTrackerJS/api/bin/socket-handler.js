'use strict';

const PIPE = {
  ACCOUNT: 'account'
};
let app = null;

const onConnect = function (ap) {
  app = ap;
  app.locals.log.info('Socket connected...');
};

const publish = function (pipe, acc) {
  app.locals.io.emit(pipe, {code: 0, data: acc});
};

module.exports = {
  onConnect: onConnect,
  publish: publish,
  PIPE: PIPE
};
