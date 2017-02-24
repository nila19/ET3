/* eslint prefer-const: "off" */

'use strict';

const user = require('../models/UserModel')();
const errcode = 1000;

module.exports = {
  checkLogin: function checkLogin(req, resp) {
    let result = {
      code: errcode,
      message: 'User login failed...'
    };

    req.app.locals.log.info('Trying to login with - ' + req.body.uid + ' : ' + req.body.pwd);
    user.checkLogin(req.app.locals.db, req.body.uid, req.body.pwd).then((usr) => {
      if (usr) {
        result.code = 0;
        result.message = 'User login successful';
      }
      resp.json(result);
    }).catch((err) => {
      req.app.locals.log.error(err);
      resp.json(result);
    });
  },
  checkName: function checkName(req, resp) {
    let result = {
      code: errcode,
      message: 'Check name failed...'
    };

    req.app.locals.log.info('Trying to check name with - ' + req.body.login);
    user.findOne(req.app.locals.db, {uid: req.body.login}).then((usr) => {
      if (usr) {
        result.code = 0;
        result.message = 'Check name successful';
      }
      resp.json(result);
    }).catch((err) => {
      req.app.locals.log.error(err);
      resp.json(result);
    });
  }
};
