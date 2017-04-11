/* eslint no-magic-numbers: "off" */
'use strict';

const accounts = require('../models/Accounts')();
const cu = require('../utils/common-utils');

let app = null;
const onConnect = function (ap, socket) {
  app = ap;

  app.locals.log.info('Socket connected...');
  setTimeout(publish, 10000, {id: 62});
  setTimeout(publish, 12000, {id: 60});
  socket.on('disconnect', function () {
    app.locals.log.info('Socket disconnected...');
  });
};

const publish = function (acct) {
  accounts.findById(app.locals.db, acct.id).then((ac) => {
    app.locals.log.info('Emitting for : ' + acct.id);
    app.locals.io.emit('account', {code: 0, data: ac});
  }).catch((err) => {
    cu.logErr(app.locals.log, err);
  });
};

module.exports = {
  onConnect: onConnect,
  publish: publish
};
