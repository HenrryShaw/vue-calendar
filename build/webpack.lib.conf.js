const path = require('path');
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')

module.exports = env => {
  return merge(webpackBaseConfig(env), 
    {
      mode: 'production',
      devtool: false,
      entry: {
        app: ['./src/index.js']
      },
      output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../lib/'),
        libraryExport: 'default',
        libraryTarget: 'commonjs2'
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
        new CopyPlugin([
          { from: 'src/index.less', to: path.resolve(__dirname, '../lib/') },
        ]),
      ],
      optimization: {
        minimizer: [
          new OptimizeCssAssetsPlugin()
        ],
      },
    }
  )
}