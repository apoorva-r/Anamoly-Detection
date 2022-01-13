import React from "react";
import Drop from "./visualisations/dropdown.js";
// import "./App.css";
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <div className="container">
      <Drop />
    </div>
  </BrowserRouter>
);

export default App;
