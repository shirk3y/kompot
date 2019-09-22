const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("../webpack.config.js");
const compiler = webpack(config);

// Implement historyApiFallback
app.use((req, res, next) => {
  if (!/(\.(?!html)\w+$|__webpack.*)/.test(req.url)) req.url = "/";
  next();
});

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    watch: true,
    writeToDisk: true,
    watchOptions: {
      ignored: /node_modules/
    }
  })
);

app.listen(3000, function() {
  console.log("Example app listening on port 3000!\n");
});
