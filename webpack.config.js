const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRootPlugin = require("html-webpack-root-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devtool: "inline-source-map",

  module: {
    rules: [
      // {
      //   test: /\.compot.ya?ml$/,
      //   use: ["compot-loader"]
      // },
      // {
      //   test: /\.ya?ml$/,
      //   use: [{ loader: "yaml" }]
      // },
      // {
      //   test: /\.ya?ml$/,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {}
      //     }
      //   ]
      // },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(svg|png|eot|woff2?|ttf|ico)$/, use: ["url-loader"] },
      {
        test: /\.(c|d|t)sv$/,
        use: [{ loader: "dsv-loader", query: { delimiter: "\t" } }]
      },
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              useCache: true,
              useBabel: true,
              babelOptions: {
                babelrc: false /* Important line */,
                presets: [
                  [
                    "@babel/preset-env",
                    { targets: "last 2 versions, ie 11", modules: false }
                  ]
                ]
              },
              babelCore: "@babel/core" // needed for Babel v7
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".css", ".yml"],
    alias: {
      "compot-loader": path.resolve(__dirname, "./src/compot-loader")
    }
  },
  // resolveLoader: {
  //   extensions: [".ts", ".js"],
  //   alias: {
  //     "compot-loader": path.resolve(__dirname, "./src/compot-loader/loader")
  //   }
  // },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  // plugins: [new HtmlWebpackPlugin(), new ReactRootPlugin()],
  plugins: [new HtmlWebpackPlugin()],
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3000,
  //   // publicPath: "/",
  //   contentBase: "./dist",
  //   hot: true,
  //   inline: true,
  //   clientLogLevel: "info"
  // },
  watch: true
};
