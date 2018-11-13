const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    app: './App.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './assets/js/[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([ {from: 'img', to: '../dist/img'} ]),
    new CopyWebpackPlugin([ {from: '*.html', to: '../dist/'} ]),
  ]
}

module.exports = config
