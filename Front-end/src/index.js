import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import blogstore from './components/blog/redux/store/index'; 

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Provider store={store}>
      <Provider store={blogstore}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
