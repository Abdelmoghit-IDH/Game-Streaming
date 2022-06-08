const { decodeAuthToken } = require('../utils/auth');
const { env, emit, appModule, statusCodes } = require('./_utils');

module.exports = authorized;

async function authorized(req, res, next) {
  const db = appModule.get('store');
  const responseData = {
    errors: [{
      value: '',
      location: 'header',
      msg: 'Invalid access token!',
      param: 'authorization_token'
    }]
  };

  try {
    const userKey = req.header('Authorization');

    if(!userKey) {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    const bearerData = userKey.split(' ');

    if(!Array.isArray(bearerData) || bearerData.length !== 2) {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    const [ bearerString, bearerToken ] = bearerData;

    if(!bearerToken || bearerString !== 'Bearer') {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    //const { authTokenSecret } = appModule.get('security') || {};
    //TODO: to change with token secret
    const tokenSecret = "secret"; //authTokenSecret || env.AUTH_TOKEN_SECRET; 
    const decoded = decodeAuthToken(bearerToken, tokenSecret);

    if(!decoded) {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    userId = decoded.id;
    email = decoded.email;
    
    if(req.session.user.id !== userId || req.session.user.email !== email) {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    const userExists = await db.findById(userId);

    if(!userExists) {
      emit('authorizationError', responseData);
      return res.status(statusCodes.unauthorized).json(responseData);
    }

    next();
  } catch(err) {
    if(err.name === 'TokenExpiredError') {
      emit('authorizationError', responseData);

      return res.status(statusCodes.unauthorized).json({
        errors: [{
          ...(responseData.errors.pop()),
          msg: 'Access token has expired'
        }],
      });
    }

    next(err);
  }
}
