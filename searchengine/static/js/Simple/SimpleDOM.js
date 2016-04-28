'use strict'

function isNativeEvent(eventname) {
    return typeof(document.body["on" + eventname]) !== "undefined";
}

// http://stackoverflow.com/questions/3076679/javascript-event-registering-without-using-jquery
function addEvent(el, eventType, handler) {
  if (el.addEventListener) { // DOM Level 2 browsers
    el.addEventListener(eventType, handler, false);
  } else if (el.attachEvent) { // IE <= 8
    el.attachEvent('on' + eventType, handler);
  } else { // ancient browsers
    el['on' + eventType] = handler;
  }
}

function removeEvent(el, eventType, handler) {
  if (el.removeEventListener) { // DOM Level 2 browsers
    el.removeEventListener(eventType, handler, false)
  } else if (el.attachEvent) { // IE <= 8
    el.detachEvent('on' + eventType, handler)
  }
}

let validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ')

// http://stackoverflow.com/questions/10865025/merge-flatten-a-multidimensional-array-in-javascript
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

/**
 */
function SimpleDOM() {
  this.props = this.getDefaultProps()
  this.refs = {}
}

SimpleDOM.prototype = Object.create(SimpleDOM.prototype)

SimpleDOM.prototype.getDefaultProps = function() {
  return {}
}

SimpleDOM.prototype.emit = function(name, data=null) {
  if (this.emitter) {
    this.emitter.emit(name, data, this)
  }
}

SimpleDOM.prototype.render = function() {
  throw "Render function is not implemented"
}

SimpleDOM.prototype.init = function() {
}

SimpleDOM.prototype.componentDidMount = function() {

}

SimpleDOM.prototype.componentWillUpdate = function() {
}

SimpleDOM.prototype.componentDidUpdate = function() {
}

SimpleDOM.prototype.componentWillUnmount = function() {

}

SimpleDOM.prototype.componentDidUnmount = function() {

}

SimpleDOM.prototype.setState = function(newState) {
  if (this.state) {
    Object.assign(this.state, newState)
  }
  this.forceUpdate()
}


SimpleDOM.prototype.setProps = function(newProps) {
  Object.assign(this.props, newProps)
  this.forceUpdate()
}

SimpleDOM.prototype.forceUpdate = function() {
  this.componentWillUpdate()

  this._render(this.element) // render element

  this.componentDidUpdate()
}

SimpleDOM.prototype._render = function(oldElement, sameLevel=false) {
  let d = null
  if (this.tagName) {
    d = this
  } else {
    d = this.render()
  }
  if (!d.tagName) {
    this.element = d._render(oldElement, false)
    if (sameLevel) {
      this.componentWillUpdate()
      this.props = d.props   // 'react' only changes props
      this.componentDidUpdate()
    }
  } else if (d) {
    this.element = this.diff(oldElement, d)
  }
  return this.element
}

SimpleDOM.prototype.diff = function(element, d) {
  if (element.tagName !== d.tagName) { // different tag
    let el = d._initialRender()
    element.parentNode.replaceChild(el, element)
    return el
  } else {
    // set content
    if (d.content) {
      let node = element.firstChild
      if (node && node.nodeName === '#text') {
        node.nodeValue = d.content
      } else {
        element.insertBefore(document.createTextNode(d.content), node)
      }
    } else {
      let node = element.firstChild
      if (node && node.nodeName === '#text' && node.nodeValue) {
        node.nodeValue = ''
      }
    }

    // set attributes
    // for (let i = 0; i < element.attributes.length; i++) {
    while(element.attributes.length > 0) {
      element.removeAttribute(element.attributes[0].name)
    }

    let eventsLength = 0,
        _eventListeners = element._eventListeners || {},
        events = {},
        findEvent = false

    if (d.attributes) {
      for (let key in d.attributes) {
        let val = d.attributes[key]
        if (isNativeEvent(key)) {
          findEvent = true
          if (_eventListeners[key] !== val) {
            removeEvent(element, key, _eventListeners[key])
            addEvent(element, key, val)
            // _eventListeners[key] = val
            events[key] = val
          }
        } else if (key === 'ref') {
          this.owner.refs[val] = element
        } else if (key === 'style' && val.constructor === Object) {
          for (let styleKey in val) {
            element.style[styleKey] = val[styleKey]
          }
        } else {
          element.setAttribute(key, val)
        }
      }
    }

    for (let key in _eventListeners) {
      if (!events[key]) {
        removeEvent(element, key, _eventListeners[key])
      }
    }
    _eventListeners = null
    if (findEvent) {
      element._eventListeners = events
    } else {
      element._eventListeners = undefined
    }

    // diff children
    if (element.children.length === d.children.length) {
      for (let i = 0; i < element.children.length; i++) {
        d.children[i]._render(element.children[i], true)
      }
    } else if (element.children.length > d.children.length) {
      let i = 0
      for (; i < d.children.length; i++) {
        d.children[i]._render(element.children[i], true)
      }
      while (element.children.length !== d.children.length) {
        element.removeChild(element.children[i])
      }
    } else { // if (element.children.length < d.children.length) {
      let i = 0
      for (; i < element.children.length; i++) {
        d.children[i]._render(element.children[i], true)
      }
      for (; i < d.children.length; i++) {
        element.appendChild(d.children[i]._initialRender())
      }
    }
    return element
  }
}

SimpleDOM.prototype.appendChildrenDOMElements = function(children) {
  if (!children.length) return

  children.forEach(child => {
    if (child.constructor === Array) {
      this.appendChildrenDOMElements(child)
    } else {
      this.element.appendChild(child._initialRender())
    }
  })
}

SimpleDOM.prototype.generateDOM = function() {
  let _eventListeners = {},
      eventLength = 0

  this.element = document.createElement(this.tagName)

  if (this.content) {
    this.element.appendChild(document.createTextNode(this.content))
  }

  if (this.attributes) {
    for (let key in this.attributes) {
      let val = this.attributes[key]
      if (isNativeEvent(key)) {
        addEvent(this.element, key, val)
        _eventListeners[key] = val
        eventLength += 1
      } else if (key === 'ref') {
        this.owner.refs[val] = this.element
      } else if (key === 'style' && val.constructor === Object) {
        for (let styleKey in val) {
          this.element.style[styleKey] = val[styleKey]
        }
      } else {
        this.element.setAttribute(key, val)
      }
    }
  }

  if (eventLength) {
    this.element._eventListeners = _eventListeners // HACK
  }

  this.appendChildrenDOMElements(this.children)

  return this.element
}

SimpleDOM.prototype._initialRender = function() {
  if (this.tagName) { // div ...
    this.generateDOM()
  } else {
    let d = this.render()
    if (d) {
      this.element = d._initialRender()
    }
    this.componentDidMount()
  }
  return this.element
}

// add tags
for (let i = 0; i < validTags.length; i++) {
  SimpleDOM.prototype[validTags[i]] = function() {
    let attributes = {},
        content = null,
        children = []

    let offset = 0
    if (arguments[offset] !== null && typeof(arguments[offset]) !== 'undefined' && arguments[offset].constructor === Object) {
      attributes = arguments[offset]
      offset += 1
    }

    if (arguments[offset] !== null && typeof(arguments[offset]) !== 'undefined' && (arguments[offset].constructor === String || arguments[offset].constructor === Number)) {
      content = arguments[offset]
      offset += 1
    }

    children = []
    function appendChildren(args, offset = 0) {
      for (let i = offset; i < args.length; i++) {
        if (args[i]) {
          if (args[i].constructor === Array) {
            appendChildren(args[i])
          } else {
            children.push(args[i])
          }
        }
      }
    }

    appendChildren(arguments, offset)

    let d = new SimpleDOM()
    d.tagName = validTags[i].toUpperCase()
    d.attributes = attributes
    d.content = content
    d.children = children
    d.owner = this
    d._eventListeners = {}
    return d
  }
}

SimpleDOM.prototype.constructor = SimpleDOM

module.exports = SimpleDOM
