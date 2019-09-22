import React from "react";
import ReactDOM from "react-dom";

// import { App } from "./editor/App.compot.yml";
import { App } from "./unistor/Unistor.compot.yml";
// import Inventory from "./inventory/Inventory";
// import { FastTooling as App } from "./fast-tooling/FastTooling";

const root = document.createElement("div");
root.setAttribute("id", "root");

const body = document.querySelector("body");
body.appendChild(root);

ReactDOM.render(<App />, root);
// ReactDOM.render(<Inventory />, root);
