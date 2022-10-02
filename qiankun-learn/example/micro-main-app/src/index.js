import React from "react";
import ReactDOM from "react-dom/client";
import { registerMicroApps, start } from "qiankun";
import "./index.css";
import App from "./App";

registerMicroApps([
  {
    name: 'vueApp',
    entry: process.env.NODE_ENV === 'development' ? '//localhost:3001' : '/app-vue/index.html',
    container: '#micro-container',
    activeRule: '/app-vue',
  },
]);
start({
  sandbox: {
    experimentalStyleIsolation: true,
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <div id="app"></div> 
  </React.StrictMode>
);

