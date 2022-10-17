import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { getCLS, getFID, getLCP } from "web-vitals";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
