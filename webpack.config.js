const path = require('path')
const HTMLWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    index: "index.html",
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HTMLWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
};
