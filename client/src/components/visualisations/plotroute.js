import React from "react";
import scatter from "./AreaScatterChart";
import table from "./Table";
import line from "./LineChart";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PlotTab from "./plottab";

const App = () => (
  <BrowserRouter>
    <PlotTab />

    <div className="container">
      <Switch>
        <Route path="/LineChart" component={line} exact />
        <Route path="/AreaScatterChart" component={scatter} />
        <Route path="/Table" component={table} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
