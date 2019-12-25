const path = require('path');
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const webpack = require('webpack')

module.exports = env => {
  return merge(webpackBaseConfig(env), 
    {
      mode: 'production',
      devtool: false,
      entry: './src/index.js',
      output: {
        filename: 'index.js'
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new MiniCssExtractPlugin({
          filename: 'index.css',
        }),
        new CleanWebpackPlugin(),
      ],
      optimization: {
        minimizer: [
          new TerserJSPlugin(),
          new OptimizeCssAssetsPlugin()
        ],
      },
    }
  )
}