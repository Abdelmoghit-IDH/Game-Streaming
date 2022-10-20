import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { postReducer } from '../reducers/post';

const rootReducer = combineReducers({
  posts: postReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const blogstore = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(thunk)));

export default blogstore;
