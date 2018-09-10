const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    })
  ]
}

module.exports = config
