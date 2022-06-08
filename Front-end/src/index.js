import './index.css';
import { BrowserRouter as Router,  useLocation} from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import blogstore from './components/blog/redux/store/index';
import React from "react";
import ReactDOM from "react-dom";
import { MyProvider } from './test';



ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={blogstore}>
        <MyProvider />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
