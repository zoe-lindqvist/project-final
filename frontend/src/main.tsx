import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

//Non-Null Assertion (!) to tell TypeScript that root element is not null
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
