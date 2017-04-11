/* eslint no-console: "off" */
'use strict';

const PIPE = {
  ACCOUNT: 'account',
  BILL: 'bill',
  TRANS: 'transaction'
};
let app = null;

const onConnect = function (ap) {
  app = ap;
  app.locals.log.info('Socket connected...');
};

const publish = function (pipe, dt) {
  console.log('Socket : ' + pipe + ' => ' + JSON.stringify(dt));
  app.locals.io.emit(pipe, {code: 0, data: dt});
};

module.exports = {
  onConnect: onConnect,
  publish: publish,
  PIPE: PIPE
};
