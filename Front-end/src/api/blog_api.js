import axios from 'axios';

const API_ENDPOINT = 'http://localhost:8080/posts';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3RuYW1lIjoiYWJkZWxtb2doaXQiLCJsYXN0bmFtZSI6ImlkaHNhaW5lIiwiZnVsbG5hbWUiOiJhYmRlbG1vZ2hpdCBpZGhzYWluZSIsImVtYWlsIjoiYWJkZWxtb2doaXQxQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWJkZWxtb2doaXQxIiwic2lnbnVwRGF0ZSI6IjIwMjItMDUtMTlUMjE6MDE6NDEuMDAwWiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NTI5OTQ3NTV9.yJQBY5j3bQLQS5TROq6QdSXHTyUJ7-MpFRUkUwuYTY0';

export const fetchPosts = async () => {
  return await axios.get(API_ENDPOINT, { headers: { Authorization: `Bearer ${token}` } });
};

export const fetchSinglePost = async id => {
  return await axios.get(`${API_ENDPOINT}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const createPost = async post => {
  return await axios.post(API_ENDPOINT, post, { headers: { Authorization: `Bearer ${token}` } });
};

export const updatePost = async (id, updatedPost) => {
  return await axios.patch(`${API_ENDPOINT}/${id}`, updatedPost, { headers: { Authorization: `Bearer ${token}` } });
};

export const deletePost = async id => {
  return await axios.delete(`${API_ENDPOINT}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
