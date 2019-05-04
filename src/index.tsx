import React from "react";
import ReactDOM from "react-dom";

// import { App } from "./forex/App.compot.yml";
// import { App } from "./editor/App.compot.yml";
// import Editor from "./editor/Editor";
import Compot from "./compot-loader/runtime";

const root = document.createElement("div");
root.setAttribute("id", "root");

const body = document.querySelector("body");
body.appendChild(root);

ReactDOM.render(
  <Compot yamlPath="./editor/App.compot.yml" importName="App" editor={true}>
    {/* <App /> */}
  </Compot>,
  root
);
