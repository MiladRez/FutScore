import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "semantic-ui-css/semantic.min.css";

const root = createRoot(document.querySelector("#root"));
root.render(<App />);