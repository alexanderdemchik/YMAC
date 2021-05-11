const dotenv = require('dotenv');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const env = dotenv.config().parsed;

module.exports = {
  entry: './src/renderer/index.tsx',
  devtool: 'source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        use: [{
          loader: '@svgr/webpack',
        }],
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: false,
    port: process.env.PORT,
    publicPath: '/',
    inline: true,
    overlay: true
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
    publicPath: './',
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
    typeorm: 'commonjs typeorm'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new DefinePlugin({'process.env': env})
  ],
};