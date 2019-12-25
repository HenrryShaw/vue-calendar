const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.conf')
const webpack = require('webpack')

module.exports = merge(webpackBaseConfig(), 
  {
    mode: 'development',
    entry: './demo/main.js',
    devServer: {
      host: '0.0.0.0'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../demo/index.html'),
        title: 'vue-calendar',
      }),
    ]
  }
)