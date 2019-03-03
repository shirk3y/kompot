import React from "react";
import ReactDOM from "react-dom";
// import App from "./App";
// import "./compot-loader";
import App from "./compot/App.compot.yml";

console.warn(typeof App);

ReactDOM.render(<App />, document.getElementById("root"));
