import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import AuthContextProvider from "./context/AuthProvider";
import HistoryContextProvider from "./context/HistoryProvider";
import SelectionContextProvider from "./context/SelectionProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <AuthContextProvider>
          <HistoryContextProvider>
              <SelectionContextProvider>
                  <App />
              </SelectionContextProvider>
          </HistoryContextProvider>
      </AuthContextProvider>
  </Router>
);

reportWebVitals();