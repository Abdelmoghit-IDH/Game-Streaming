import axios from 'axios';

const apiServer = process.env.API_GATEWAY;
const API_ENDPOINT = apiServer +'/blogs';

export const fetchPosts = async  () => {
  return await axios.get(API_ENDPOINT );
};

export const fetchSinglePost = async id => {
  return await axios.get(`${API_ENDPOINT}/blogbyid/${id}`, );
};

export const fetchPostsBychanid = async id => {
  return await axios.get(`${API_ENDPOINT}/blogbychanid/${id}` );
};

export const createPost = async (post, user) => {
  return await axios.post(`${API_ENDPOINT}/createblog`, post, { headers: { Authorization: `Bearer ${user.token}` } });
};

export const updatePost = async (id, updatedPost, user) => {
  return await axios.patch(`${API_ENDPOINT}/updateblog/${id}`, updatedPost, { headers: { Authorization: `Bearer ${user.token}` } });
};

export const deletePost = async (id, user) => {
  return await axios.delete(`${API_ENDPOINT}/deleteblog/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
};
