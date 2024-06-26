import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import Store from "./ReduxStore/Store/Store";
import { HashRouter } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Provider store={Store}>
      <App />
    </Provider>
  </HashRouter>
);

reportWebVitals();
