import * as types from './types';
import * as api from '../../../../api/blog_api';

export const fetchPosts = () => async dispatch => {
  try {
    dispatch({ type: types.FETCH_POSTS_REQUEST });
    const { data } = await api.fetchPosts();
    dispatch({ type: types.FETCH_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: types.FETCH_POSTS_FAIL, payload: error.message });
  }
};

export const fetchSinglePost = id => async dispatch => {
  try {
    dispatch({ type: types.FETCH_SINGLE_POST_REQUEST });
    const { data } = await api.fetchSinglePost(id);
    dispatch({ type: types.FETCH_SINGLE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: types.FETCH_SINGLE_POST_FAIL, payload: error.message });
  }
};

export const createPost = (post,user) => async dispatch => {
  try {
    dispatch({ type: types.CREATE_POST_REQUEST, payload: post });
    const { data } = await api.createPost(post,user);
    dispatch({
      type: types.CREATE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({ type: types.CREATE_POST_FAIL, payload: error.message });
  }
};

export const updatePost = (id, post, user) => async dispatch => {
  try {
    dispatch({ type: types.UPDATE_POST_REQUEST });
    const { data } = await api.updatePost(id, post,user);
    dispatch({
      type: types.UPDATE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({ type: types.UPDATE_POST_FAIL, payload: error.message });
  }
};

export const deletePost = (id,user) => async dispatch => {
  try {
    dispatch({ type: types.DELETE_POST_REQUEST });
    const { data } = await api.deletePost(id,user);
    dispatch({
      type: types.DELETE_POST_SUCCESS,
      payload: data._id,
    });
  } catch (error) {
    dispatch({ type: types.DELETE_POST_FAIL, payload: error.message });
  }
};
