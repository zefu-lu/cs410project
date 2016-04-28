'use strict'
/*
 * Event emitter class
 */

let emitters = {}

function Emitter(initialState = {}) {
  this.subscriptions = {}
  this.id = null

  if (initialState.constructor === Function) {
    let initFunc = initialState
    this.state = initialState
    initFunc.call(this)
  } else {
    this.state = initialState
  }
}

Emitter.prototype.constructor = Emitter

Emitter.prototype.registerId = function(id) {
  if (emitters[id]) {
    throw `Error: ${id} is already registered in Emitters`
  } else {
    this.id = id
    emitters[id] = this
  }
}

Emitter.getEmitterById = function(id) {
  return emitters[id]
}

// emitter.emit()
Emitter.prototype.emit = function(name, data=null, sender=null) {
  if (this.subscriptions[name]) {
    this.subscriptions[name].call(this, data, sender)
  }
}

// emitter.on()
// callback should be
// - function(data, component) {
//   }
Emitter.prototype.on = function() {
  if (arguments.length === 2) {
    let name = arguments[0],
        callback = arguments[1]
    if (this.subscriptions[name]) {
      throw `Error: ${name} is already registered in Emitter object`
    } else {
      this.subscriptions[name] = callback
    }
  } else {
    let obj = arguments[0]
    for (let name in obj) {
      this.on(name, obj[name])
    }
  }
}

// unsubscript the event
Emitter.prototype.off = function(name) {
  this.subscriptions[name] = null
}


Emitter.prototype.destroy = function() {
  this.state = {}
  this.subscriptions = {}
}

/*
Emitter.prototype.getState = function() {
  return this.state
}
*/

module.exports = Emitter
