const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const env = process.env.NODE_ENV;

module.exports = (env) => ({
  target: "node",
  externals: [nodeExternals()],
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./package.json" }, { from: "./auth.json" }]
    }),
    new Dotenv({
      path: `./.env${env.ENV !== "local" && `.${env.ENV}`}`
    })
  ],
  externalsPresets: {
    node: true
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "youtube.js",
    publicPath: "/",
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin()]
  }
});
