import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AdaptContext } from "@state-adapt/react";
import { stateadapt } from "./state-adapt";

ReactDOM.render(
  <React.StrictMode>
    <AdaptContext.Provider value={stateadapt}>
      <App />
    </AdaptContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
