#!/usr/bin/env node

const util = require('util');
const env = require('./dotenv');
const db = require('./databases');
const debug = require('./utils/debug');
const hooks = require('./utils/hooks');
const setupRouting = require('./routes');
const prepare = require('./utils/prepare');
const userModule = require('./user-module');
const middlewares = require('./middlewares');
const { generateRoute } = require('./utils');
const defaults = require('./routes/defaults');
const appName = 'express-user-manager';
const validAdapters = db.validAdapters;
const validAdaptersMsg = `Valid adapters include: ${validAdapters.join(', ')}`;

// Augment the userModule with midddlewares
userModule.set('middlewares', middlewares);

userModule.init = init;
userModule.config = config;
userModule.listen = listen;
userModule.getDbAdapter = getDbAdapter;
userModule.addRequestHook = addRequestHook;
userModule.addResponseHook = addResponseHook;
userModule.removeRequestHook = removeRequestHook;
userModule.removeResponseHook = removeResponseHook;

module.exports = userModule;

function config(options) {
  if(!options || typeof options !== 'object') {
    throw new Error(`${appName}::config: expects an object as the first argument`);
  }

  debug('Setting up configuration properties...');
  for(let [key, value] of Object.entries(options)) {
    debug(`Configuring ${key} with value ${util.inspect(value)}...`);
    userModule.set(key, value);
    debug(`${key} configuration done`);
  }
  debug('Configuration setup complete');
}


async function init(app, options) {
  const methodName = 'init';

  if(!app || typeof app.use !== 'function') {
    throw new Error(`${appName}::${methodName}: expects an Express app as the first argument`);
  }

  if(!options || typeof options !== 'object') {
    throw new Error(`${appName}::${methodName}: expects an object as the second argument`);
  }

  debug('Setup process started...');
  // Add configuration properties to the userModule object
  config(options);

  // Begin mount point setup
  // Ensure we have a valid mount point
  let apiMountPoint = userModule.get('apiMountPoint');

  apiMountPoint = typeof apiMountPoint === 'string'
    ? apiMountPoint
    : env.API_MOUNT_POINT;

  apiMountPoint = (
    typeof apiMountPoint === 'string'
      ? apiMountPoint
      : ''
  ).trim();

  apiMountPoint = apiMountPoint.length > 0 ? apiMountPoint : defaults.base;

  const routes = {};
  const defaultRoutes = defaults.paths;
  const customRoutes = userModule.get('routes');

  // Setup custom routing allowing the user to overwrite the default routes
  for(const pathName in defaultRoutes) {
    if(pathName in customRoutes) {
      let path = customRoutes[pathName];

      path = (typeof path === 'string' ? path : '').trim();
      routes[pathName] = path || defaultRoutes[pathName];
    }
  }


  const dbConfig = userModule.get('db');
  const adapter = dbConfig.adapter || env.DB_ADAPTER;

  if(!validAdapters.includes(adapter)) {
    throw new Error(`${appName}::${methodName}: invalid adapter "${adapter}". ${validAdaptersMsg}`);
  }

  const store = userModule.getDbAdapter(adapter);

  await store.connect(prepareConnectionParameters(dbConfig));

  userModule.listen(app, apiMountPoint, routes);
  debug('Setup complete. Your application is ready');
}

function getDbAdapter(adapter) {
  const dbConfig = userModule.get('db');

  if(typeof adapter === 'string') {
    adapter = adapter.trim();
  } else if(dbConfig && dbConfig.adapter) {
    adapter = dbConfig.adapter;
  } else if(!adapter || typeof adapter !== 'string') {
    adapter = env.DB_ADAPTER;
  }

  if(!adapter || typeof adapter !== 'string') {
    const msg = `${appName}::getDbAdapter: no adapter found via config or environment variable. ` +
    `Pass a string as the first argument. ${validAdaptersMsg}`;
    throw new Error(msg);
  }

  adapter = adapter.toLowerCase();

  if(!validAdapters.includes(adapter)) {
    throw new Error(`${appName}::getAdapter: invalid adapter ${adapter}. ${validAdaptersMsg}`);
  }

  const store = db.getAdapter(adapter);
  const clonedStore = { ...store };
  const storeMethods = [
    'disconnect',
    'createUser',
    'getUsers',
    'searchUsers',
    'findByEmail',
    'findByUsername',
    'findById',
    'updateUser',
    'deleteUser'
  ];

  for(let key of storeMethods) {
    clonedStore[key] = store[key];
  }

  clonedStore.connect = connect;

  debug('Registering the store...');
  userModule.set('store', clonedStore);
  debug('Store registration complete');

  return clonedStore;

  async function connect(opts) {
    const dbConfig = userModule.get('db');
    opts = opts || dbConfig;

    return await store.connect(prepareConnectionParameters(opts));
  }
}



function listen(app, baseApiRoute = '/api/auth', customRoutes = {}) {
  debug('Setting up routing...');

  baseApiRoute = typeof baseApiRoute === 'string'
    ? baseApiRoute.trim()
    : '';

  let apiMountPoint = (baseApiRoute.length > 0 
    ? baseApiRoute
    : String(userModule.get('apiMountPoint'))
  ).trim();

  if(apiMountPoint.length <= 0) {
    apiMountPoint = '/api/users';
  }

  debug('Setting up path listeners...');
  const configuredRoutes = userModule.get('routes');
  const routeListener = setupRouting({ ...configuredRoutes, ...customRoutes });
  debug('Path listeners setup complete');

  debug('Setting up express middlewares...');
  let sessionSecret = (userModule.get('security') || {}).sessionSecret;
  app = prepare(app, sessionSecret || "session"); //TODO: to change
  debug('Express middlewares setup complete');

  debug('Setting up mount point...');
  app.use(new RegExp(`${apiMountPoint}`, 'i'), routeListener);
  debug(`Routing setup complete. Listening for requests at ${baseApiRoute}`);
}

function addRequestHook(target, fn) {
  addHook('request', target, fn);
}

function addResponseHook(target, fn) {
  addHook('response', target, fn);
}

function removeRequestHook(target, fn) {
  removeHook('request', target, fn);
}

function removeResponseHook(target, fn) {
  removeHook('response', target, fn);
}


function addHook(type, target, fn) {
  const routes = { ...userModule.get('routes') }; //{ ...defaults.paths };
  const validRoutes = Object.keys(routes);
  const sentenceType = type[0].toUpperCase() + type.substring(1);

  if(typeof target === 'string') {
    target = target.trim();

    if(target === '*') {
      for(const pathName in routes) {
        hooks.add(type, generateRoute(pathName), fn);
      }
    } else {
      if(!validRoutes.includes(target)) {
        throw new Error(`${appName}::add${sentenceType}Hook: invalid hook target "${target}"`);
      }

      if(Array.isArray(fn)) {
        for(let i = 0; i < fn.length; i++) {
          hooks.add(type, generateRoute(target), fn[i]);
        }
      } else {
        hooks.add(type, generateRoute(target), fn);
      }
    }
  } else if(Array.isArray(target)) {
    target = target.map(val => val.trim());

    if(Array.isArray(fn)) {
      for(let i = 0; i < target.length; i++) {
        if(validRoutes.includes(target[i])) {
          hooks.add(type, generateRoute(target[i]), fn[i]);
        }
      }
    } else {
      for(const route of target) {
        if(validRoutes.includes(route)) {
          hooks.add(type, generateRoute(route), fn);
        }
      }
    }
  }
}

function removeHook(type, target, fn) {
  const routes = { ...userModule.get('routes') };

  if(typeof target === 'string') {
    target = target.trim();

    if(target === '*') {
      for(const pathName in routes) {
        hooks.remove(type, generateRoute(pathName), fn);
      }
    } else {
      if(Array.isArray(fn)) {
        for(let i = 0; i < fn.length; i++) {
          hooks.remove(type, generateRoute(target), fn[i]);
        }
      } else {
        hooks.remove(type, generateRoute(target), fn);
      }
    }
  } else if(Array.isArray(target)) {
    target = target.map(val => val.trim());

    if(Array.isArray(fn)) {
      for(let i = 0; i < target.length; i++) {
        hooks.remove(type, generateRoute(target[i]), fn[i]);
      }
    } else {
      for(const route of target) {
        hooks.remove(type, generateRoute(route), fn);
      }
    }
  }
}

function prepareConnectionParameters(opts) {
  const dbConfig = opts || {};

  const adapter = dbConfig.adapter || env.DB_ADAPTER;
  const host = dbConfig.host || env.DB_HOST;
  const port = dbConfig.port || env.DB_PORT;
  const user = dbConfig.user || env.DB_USERNAME;
  const pass = dbConfig.pass || env.DB_PASSWORD;
  const engine = dbConfig.engine || env.DB_ENGINE;
  const dbName = dbConfig.dbName || env.DB_DBNAME;
  const storagePath = dbConfig.storagePath || env.DB_STORAGE_PATH;
  const debug = dbConfig.debug || env.DB_DEBUG;
  const exitOnFail = dbConfig.exitOnFail || env.EXIT_ON_DB_CONNECT_FAIL;

  return {
    adapter,
    host, port, user, pass,
    engine, dbName, storagePath,
    debug, exitOnFail,
  };
}
