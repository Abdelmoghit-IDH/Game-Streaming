import axios from 'axios';
const API_ENDPOINT = 'http://localhost:3003/posts';

export const fetchPosts = async  () => {
  return await axios.get(API_ENDPOINT );
};

export const fetchSinglePost = async id => {
  return await axios.get(`${API_ENDPOINT}/${id}`, );
};

export const createPost = async (post, user) => {
  return await axios.post(API_ENDPOINT, post, { headers: { Authorization: `Bearer ${user.token}` } });
};

export const updatePost = async (id, updatedPost, user) => {
  return await axios.patch(`${API_ENDPOINT}/${id}`, updatedPost, { headers: { Authorization: `Bearer ${user.token}` } });
};

export const deletePost = async (id, user) => {
  return await axios.delete(`${API_ENDPOINT}/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
};
