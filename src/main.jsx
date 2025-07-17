// Set up Buffer polyfill for browser compatibility
if (typeof window !== "undefined") {
  import("buffer")
    .then(({ Buffer }) => {
      window.Buffer = Buffer;
      window.global = window;
    })
    .catch(() => {
      // Fallback if buffer import fails
      console.warn("Buffer polyfill not available");
    });
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
