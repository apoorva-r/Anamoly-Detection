import React from "react";
import FileUpload from "./components/FileUpload";
import "./App.css";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation";
import Plots from "./components/Plots";

const App = () => (
  <BrowserRouter>
    <Navigation />
    <div className="container">
      <switch>
        <Route path="/" component={FileUpload} exact />
        <Redirect from="/" to="/" />

        <Route path="/Plots" component={Plots} />
      </switch>
    </div>
  </BrowserRouter>
);

export default App;
