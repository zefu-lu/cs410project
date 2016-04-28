'use strict'
let SimpleDOM = require('./SimpleDOM.js')

function createSimpleComponent(methods) {
  let SimpleComponent = function(props, ...children) {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleDOM.call(this)

    if (children) {
      this.children = children
    }

    if (props) {
      Object.assign(this.props, props)
    }

    this.init()
    //this.forceUpdate()      // render element
    //this.componentDidMount()
  }

  SimpleComponent.prototype = Object.create(SimpleDOM.prototype)

  for (let key in methods) {
    SimpleComponent.prototype[key] = methods[key]
  }

  SimpleComponent.prototype.constructor = SimpleComponent

  return SimpleComponent
}

function createStatelessSimpleComponent(func) {
  let SimpleComponent = function(props) {
    if (!this || (!this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleDOM.call(this)

    this.render = func.bind(this, props)
    // this.toDOM(func.call(this, props)) // render element
  }
  SimpleComponent.prototype = Object.create(SimpleDOM.prototype)

  return SimpleComponent
}

function Component(arg) {
  if (arg.constructor === Function) {
    return createStatelessSimpleComponent(arg)
  } else {
    return createSimpleComponent(arg)
  }
}

module.exports = Component
