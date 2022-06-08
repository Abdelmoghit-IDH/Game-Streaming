const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const randomBytes = require('random-bytes');
const { firstname } = require('../databases/adapters/sequelize/user-schema');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateAuthToken = (user, tokenSecret, tokenExpiry, kid) => {
  const tokenData   = user;
  const signedToken = jwt.sign(tokenData, tokenSecret, { //TODO: change 
    algorithm: "HS256",
    expiresIn: tokenExpiry,
    header: { kid: kid },
  });

  return { token: signedToken, expiry: tokenExpiry };
};

const decodeAuthToken = (token, tokenSecret) => jwt.verify(token, tokenSecret);

module.exports = {
  hashPassword,
  checkPassword,
  generateAuthToken,
  decodeAuthToken,
};
