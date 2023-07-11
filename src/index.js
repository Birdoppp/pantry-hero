import React from "react";

// PAGES
import App from "./App";

// DEPENDENCIES
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

// CONTEXT
import AuthContextProvider from "./context/AuthProvider";
import HistoryContextProvider from "./context/HistoryProvider";
import SelectionContextProvider from "./context/SelectionProvider";

// STYLES
import "./index.css";

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