const express = require('express');
const handlers = require('./handlers');
const hooks = require('../utils/hooks');
const apiPaths = require('./defaults').paths;
const loadUser = require('../middlewares/load-user');
const loggedIn = require('../middlewares/logged-in');
const authorized = require('../middlewares/authorized');
const notLoggedIn = require('../middlewares/not-logged-in');
const validator = require('../middlewares/validators/_validator');
const restrictUserToSelf = require('../middlewares/restrict-user-to-self');
const checkExpressValidatorStatus = require('../middlewares/express-validator-status-checker');

const { userModule, generateRoute } = require('../utils');
const { keys: routeKeys } = require('./defaults');

function invokeHooks(target) {
  return function(req, res, next) {
    hooks.execute('request', generateRoute(target), req, res, next);
  };
}

function setupRouting(customRoutes = {}) {
  const router = express.Router();
  const routes = { ...apiPaths };

  // Setup custom routing allowing the user to overwrite the default routes
  for(const pathName in routes) {
    if(pathName in customRoutes) {
      let path = customRoutes[pathName];

      path = (typeof path === 'string' ? path : '').trim();
      routes[pathName] = path || routes[pathName];
    }
  }

  userModule.set('routes', routes); // used by src/utils/index.js::generateRoute()

  /* GET users listing. */
  router.get(routes.list, invokeHooks(routeKeys.list), handlers.get);

  /* Search for users */
  router.get(routes.search, invokeHooks(routeKeys.search), handlers.search);

  /* Get a user by username */
  router.get(`${routes.getUser}/:username`,
    invokeHooks(routeKeys.getUser),
    loadUser,
    handlers.getUser
  );

  /* Create (i.e, register) a new user */
  router.post(routes.signup,
    invokeHooks(routeKeys.signup),
    notLoggedIn,
    validator.validate('firstname', 'lastname', 'username', 'email', 'password', 'confirmPassword'),
    checkExpressValidatorStatus('signupError'),
    handlers.create
  );

  /* Authenticate a user(, and return an authorization key)*/
  router.post(routes.login,
    invokeHooks(routeKeys.login),
    notLoggedIn,
    validator.validate('login', 'password'),
    checkExpressValidatorStatus('loginError'),
    handlers.login
  );

  /* Update user data */
  router.put(routes.updateUser,
    invokeHooks(routeKeys.updateUser),
    loggedIn,
    authorized,
    restrictUserToSelf,
    validator.validate('id', 'firstname', 'lastname', 'username', 'email'),
    checkExpressValidatorStatus('updateUserError'),
    handlers.updateUser
  );

  router.get(routes.logout, invokeHooks(routeKeys.logout), handlers.logout);

  /**
   * DANGER: Delete user by id
   * This was created so we can delete user we created during tests
   * Use with CAUTION
   */
  router.delete(`${routes.deleteUser}/:userId`,
    invokeHooks(routeKeys.deleteUser),
    loggedIn,
    authorized,
    handlers.deleteUser
  );

  return router;
}

module.exports = setupRouting;
