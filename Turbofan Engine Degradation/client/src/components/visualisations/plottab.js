import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Tabs, Button } from "react-bootstrap";
import "./VisTab.css";
import { TabPane, TabContent, TabContainer } from "react-bootstrap";

export class Navigation extends Component {
  render() {
    return (
      <TabContainer>
        <Nav className="mr-auto1">
          <NavLink to="/LineChart" eventkey="line" id="Link" className="line">
            <Button className="line" variant="primary">
              Line Chart
            </Button>
          </NavLink>
          <NavLink
            to="/AreaScatterChart"
            eventkey="scatter"
            className="scatter"
          >
            <Button className="scatter" variant="primary">
              Scatter Chart
            </Button>
          </NavLink>
          <NavLink to="/Table" eventkey="pie" className="pie">
            <Button className="pie" variant="primary">
              Correlation Table
            </Button>
          </NavLink>
        </Nav>
        <TabContent>
          <Tabs id="uncontrolled-tab-example">
            <TabPane eventkey="line">line</TabPane>
          </Tabs>
          <Tabs id="uncontrolled-tab-example">
            <TabPane eventkey="scatter">scatter</TabPane>
          </Tabs>
          <Tabs id="uncontrolled-tab-example">
            <TabPane eventkey="pie">Correlation Table</TabPane>
          </Tabs>
        </TabContent>
      </TabContainer>
    );
  }
}

export default Navigation;
