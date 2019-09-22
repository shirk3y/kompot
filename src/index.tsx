import React from "react";
import ReactDOM from "react-dom";

import { App } from "./zielinski/Zielinski.compot.yml";

const root = document.createElement("div");
root.setAttribute("id", "root");

const body = document.querySelector("body");
body.appendChild(root);

ReactDOM.render(<App />, root);
