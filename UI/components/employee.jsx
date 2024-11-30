import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const element = (
  <HashRouter>
    <Navbar/>
  </HashRouter>
);
ReactDOM.render(element, document.getElementById("root"));
