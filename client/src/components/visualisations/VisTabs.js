import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Tabs } from "react-bootstrap";
import "./VisTab.css";
import { TabPane, TabContent, TabContainer } from "react-bootstrap";

export class Navigation extends Component {
  render() {
    return (
      <div>
        <TabContainer>
          <Nav className="mr-auto">
            <NavLink
              to="/dropdown.js"
              eventkey="dropdown"
              id="dropdown"
              className="dropdown"
            >
              Load
            </NavLink>
          </Nav>
          <TabContent>
            <Tabs id="uncontrolled-tab-example">
              <TabPane eventkey="dropdown"></TabPane>
            </Tabs>
          </TabContent>
        </TabContainer>
      </div>
    );
  }
}

export default Navigation;
