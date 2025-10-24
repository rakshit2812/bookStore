import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { InactivityProvider } from "./contexts/InactivityContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import axios config to set global defaults BEFORE any other imports
import "./utils/axios.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <InactivityProvider>
      <div className="bg-white text-black dark:bg-slate-950 dark:text-white">
        <App />
      </div>
    </InactivityProvider>
  </BrowserRouter>
);
