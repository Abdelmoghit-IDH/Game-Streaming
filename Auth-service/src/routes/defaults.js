const baseApiRoute = '/api/users';
const apiPaths = {
  list: '/list',
  search: '/search',
  getUser: '/user',
  signup: '/signup',
  login: '/signin',
  logout: '/logout',
  updateUser: '/update',
  deleteUser: '/user',
};

const pathKeys = Object.keys(apiPaths).reduce((ret, key) => {
  ret[key] = key;
  return ret;
}, {});

module.exports = {
  base: baseApiRoute,
  paths: apiPaths,
  keys: pathKeys,
};
