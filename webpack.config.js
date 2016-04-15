'use strict'
let path = require('path')
module.exports = {
  entry: path.resolve(__dirname, './www/js/app.jsx'),
  output: {
    path: path.resolve(__dirname, './www'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
       {
         test: /\.(js|jsx)$/,
         include: [path.resolve(__dirname, 'www')],
         exclude: [/node_modules/],
         loader: 'babel',
         query: {
           presets: ['es2015']
         }
       },
       { test: /\.html$/, loader: 'raw' },
    ]
  }
}
