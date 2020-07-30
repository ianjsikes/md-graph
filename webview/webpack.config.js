//@ts-check

'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**@type {import('webpack').Configuration}*/
const config = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
}
module.exports = config
