const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = env => {

  function styleLoader(loader, loaderOption) {
    let options = loaderOption || {}
    let loaders = ['vue-style-loader', 'css-loader']
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options
      })
    }
    if (env === 'production') {
      loaders.splice(1, 0, {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      })
    }
    return loaders
  }

  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: styleLoader(''),
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          use: styleLoader('less', {
            modifyVars: {
              'primary-color': '#22c39b',
            }
          }),
          exclude: /node_modules/
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src')
      },
      extensions: [ '.tsx', '.ts', '.js', '.vue' ],
    }
  }
}