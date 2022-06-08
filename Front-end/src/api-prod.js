import axios from "axios";
const { REACT_APP_CLIENT_ID, REACT_APP_AUTHORIZATION } = process.env;

// prettier-ignore
let api = axios.create({
  headers: {
    'Client-ID': REACT_APP_CLIENT_ID,
    'Authorization': REACT_APP_AUTHORIZATION,
  },
});

export default api;
