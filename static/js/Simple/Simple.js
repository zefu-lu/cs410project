'use strict'

let Component = require('./Component.js')
let Emitter = require('./Emitter.js')

let render = function(component, domElement) {
  let element = component._initialRender()
  if (element) {
    domElement.appendChild(element)
  }
}

let createEmitter = function(initialState) {
  return new Emitter(initialState)
}

let Simple = {
  Component,
  Emitter,
  createEmitter,
  render
}

if (typeof(window) !== 'undefined') {
  window.Simple = Simple
}

if (typeof(module) !== 'undefined') {
  module.exports = Simple
}

export default Simple
export {Component, Emitter, createEmitter, render}
