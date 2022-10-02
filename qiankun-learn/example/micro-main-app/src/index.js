import React from "react";
import ReactDOM from "react-dom/client";
import { registerMicroApps, start } from "qiankun";
import "./index.css";
import App from "./App";

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:3001',
    container: '#micro-container',
    activeRule: '/app-vue',
  },
]);
start();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

