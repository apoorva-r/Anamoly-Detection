import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import "./Navigation.css";
// eslint-disable-next-line
import Plots from "./Plots";
export class Navigation extends Component {
  render() {
    return (
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>Anomaly Detection</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/" id="Link" className="Home">
              Home
            </NavLink>
            {/* <NavLink to="/Plots" className="Plots">
              Plots
            </NavLink> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
