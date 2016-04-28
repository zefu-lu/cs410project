'use strict'
let path = require('path')
module.exports = {
  entry: path.resolve(__dirname, './www/js/app.js'),
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
           presets: ['es2015', 'react']
         }
       },
       { test: /\.html$/, loader: 'raw' },
    ]
  }
}
