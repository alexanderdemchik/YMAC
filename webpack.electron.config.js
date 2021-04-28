const path = require('path');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const env = require('dotenv').config().parsed;

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: 'source-map',
  entry: './src/main/main.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: 'main.js',
    clean: true
  },
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  plugins: [
    new ContextReplacementPlugin(/any-promise/),
    new DefinePlugin(env)
  ],
};