import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak from "./helpers/Keycloak";
import { AuthProvider } from "react-oidc-context";

const onSigninCallback = () => {
	const url = new URL(window.location.href);
	url.search = "";
	window.history.replaceState({}, "", url);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider {...keycloak} onSigninCallback={onSigninCallback}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
