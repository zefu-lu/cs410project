/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Simple = __webpack_require__(1);

	var _Simple2 = _interopRequireDefault(_Simple);

	var _emitter = __webpack_require__(5);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var KEYWORDS = {};
	if (window.localStorage.keywords) {
	  KEYWORDS = JSON.parse(window.localStorage.keywords);
	}

	var Card = _Simple2.default.Component({
	  showHTML: function showHTML() {
	    window.open(this.props.link, '_blank');
	  },
	  render: function render() {
	    return this.div({ class: 'card', click: this.showHTML.bind(this) }, this.p({ class: 'title' }, this.props.title), this.a({ class: 'link', href: this.props.link }, this.props.link.slice(0, 64) + '...'));
	  }
	});

	var Result = _Simple2.default.Component({
	  emitter: _emitter2.default,
	  getDefaultProps: function getDefaultProps() {
	    return {
	      isRecommendation: false,
	      query: '',
	      counts: 0,
	      results: [],
	      searching: true,
	      time: 0,
	      page: 0
	    };
	  },
	  search: function search() {
	    var _this = this;

	    var query = this.refs.search.value.trim();
	    if (!query.length) return;
	    this.props.query = query;
	    var page = 0,
	        size = 10;

	    this.props.searching = true;
	    this.emit('search', { query: query, size: size, page: page });

	    // save to KEYWORDS
	    KEYWORDS[query] = true;
	    window.localStorage.keywords = JSON.stringify(KEYWORDS);

	    this.props.time = 0;
	    this.interval = setInterval(function () {
	      _this.props.time += 0.01;
	    }, 10);

	    this.setProps({ isRecommendation: false });
	  },
	  componentDidMount: function componentDidMount() {
	    var _this2 = this;

	    if (!this.props.isRecommendation && this.props.query) {
	      var query = this.props.query.toLowerCase(),
	          size = 10,
	          page = 0;

	      this.props.searching = true;
	      this.emit('search', { query: query, size: size, page: page });

	      // save to KEYWORDS
	      KEYWORDS[query] = true;
	      window.localStorage.keywords = JSON.stringify(KEYWORDS);

	      this.props.time = 0;
	      this.interval = setInterval(function () {
	        _this2.props.time += 0.01;
	      }, 10);
	    } else {
	      this.recommend();
	    }
	  },
	  stopTimer: function stopTimer() {
	    clearInterval(this.interval);
	  },
	  searchPage: function searchPage(page) {
	    var query = this.props.query.toLowerCase(),
	        size = 10;

	    this.props.searching = true;
	    this.emit('search', { query: query, size: size, page: page });
	  },
	  onInput: function onInput(event) {
	    if (event.keyCode === 13) {
	      this.search();
	    }
	  },
	  recommend: function recommend() {
	    var _this3 = this;

	    this.refs.search.value = '';
	    this.emit('recommend', { keywords: Object.keys(KEYWORDS).join('\n') });

	    this.props.time = 0;
	    this.interval = setInterval(function () {
	      _this3.props.time += 0.01;
	    }, 10);

	    this.setProps({ searching: true, isRecommendation: true });
	  },
	  render: function render() {
	    var results = [];
	    if (typeof this.props.results === 'string') {
	      // not found
	      results = null;
	      this.props.counts = 0;
	    } else {
	      results = this.props.results.map(function (d) {
	        return Card({ title: d[1], link: d[2] });
	      });
	    }

	    var pagesList = [];
	    if (!this.props.searching && this.props.counts && !this.props.isRecommendation) {
	      for (var i = 0; i < Math.ceil(this.props.counts / 10); i++) {
	        pagesList.push(this.span({ class: 'page ' + (this.props.page === i ? 'selected' : ''), click: this.searchPage.bind(this, i) }, i + 1));
	      }
	    }

	    return this.div({ class: 'result-page' }, this.div({ class: 'search-div' }, this.div({ class: 'pic-div' }, this.img({ class: 'pic', click: function click() {
	        location.reload();
	      }, src: './images/Lus-Garden.png' })), this.div({ class: 'search-box-div' }, this.input({ class: 'search-box', value: this.props.query, ref: 'search', keyup: this.onInput.bind(this) }), this.button({ class: 'mdl-button mdl-js-button mdl-button--icon', style: { marginLeft: '8px' }, click: this.search.bind(this) }, this.i({ class: 'material-icons' }, 'search')), this.button({ class: 'mdl-button mdl-js-button mdl-button--icon', click: this.recommend.bind(this) }, this.i({ class: 'material-icons' }, 'mood')))), this.props.isRecommendation ? this.div({ class: 'results' }, this.p({ class: 'intro' }, this.props.searching ? 'recommending...' : this.props.counts + ' results found in ' + this.props.time.toFixed(4)), results, null) : this.div({ class: 'results' }, this.p({ class: 'intro' }, this.props.searching ? 'searching...' : this.props.counts + ' results found in ' + this.props.time.toFixed(4)), results, !this.props.searching ? this.div({ class: 'pages-list' }, pagesList) : null));
	  }
	});

	var App = _Simple2.default.Component({
	  init: function init() {
	    /*
	     *   MAIN_PAGE
	     *   RECOMMENDATION_RESULT
	     *   SEARCH_RESULT
	     */
	    this.state = { page: 'MAIN_PAGE' };
	  },
	  showRecommendationResult: function showRecommendationResult() {
	    this.setState({ page: 'RECOMMENDATION_RESULT' });
	  },
	  onInput: function onInput(event) {
	    if (event.keyCode === 13) {
	      this.showSearchResult();
	    }
	  },
	  showSearchResult: function showSearchResult() {
	    if (!this.refs.search.value.trim().length) return;
	    this.setState({ page: 'SEARCH_RESULT', query: this.refs.search.value });
	  },
	  render: function render() {
	    if (this.state.page === 'MAIN_PAGE') {
	      return this.div({ class: 'app' }, this.div({ class: 'container' }, this.div({ class: 'pic' }), this.input({ ref: 'search', autofocus: 'true', keyup: this.onInput.bind(this) }), this.div({ class: 'button-group' }, this.div({ class: 'search-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showSearchResult.bind(this) }, 'Search'), this.div({ class: 'lucky-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showRecommendationResult.bind(this) }, 'Feeling Lucky'))));
	    } else if (this.state.page === 'RECOMMENDATION_RESULT') {
	      return Result({ isRecommendation: true, query: '' });
	    } else if (this.state.page === 'SEARCH_RESULT') {
	      return Result({ isRecommendation: false, query: this.state.query });
	    } else {
	      throw 'Wrong Page';
	    }
	  }
	});

	var app = App();
	_Simple2.default.render(app, document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Component = __webpack_require__(2);
	var Emitter = __webpack_require__(4);

	var render = function render(component, domElement) {
	  var element = component._initialRender();
	  if (element) {
	    domElement.appendChild(element);
	  }
	};

	var createEmitter = function createEmitter(initialState) {
	  return new Emitter(initialState);
	};

	var Simple = {
	  Component: Component,
	  Emitter: Emitter,
	  createEmitter: createEmitter,
	  render: render
	};

	if (typeof window !== 'undefined') {
	  window.Simple = Simple;
	}

	if (true) {
	  module.exports = Simple;
	}

	exports.default = Simple;
	exports.Component = Component;
	exports.Emitter = Emitter;
	exports.createEmitter = createEmitter;
	exports.render = render;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDOM = __webpack_require__(3);

	function createSimpleComponent(methods) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !(this instanceof SimpleComponent)) {
	      return new SimpleComponent(props);
	    }
	    SimpleDOM.call(this);

	    for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      children[_key - 1] = arguments[_key];
	    }

	    if (children) {
	      this.children = children;
	    }

	    if (props) {
	      Object.assign(this.props, props);
	    }

	    this.init();
	    //this.forceUpdate()      // render element
	    //this.componentDidMount()
	  };

	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);

	  for (var key in methods) {
	    SimpleComponent.prototype[key] = methods[key];
	  }

	  SimpleComponent.prototype.constructor = SimpleComponent;

	  return SimpleComponent;
	}

	function createStatelessSimpleComponent(func) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !this instanceof SimpleComponent) {
	      return new SimpleComponent(props);
	    }
	    SimpleDOM.call(this);

	    this.render = func.bind(this, props);
	    // this.toDOM(func.call(this, props)) // render element
	  };
	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);

	  return SimpleComponent;
	}

	function Component(arg) {
	  if (arg.constructor === Function) {
	    return createStatelessSimpleComponent(arg);
	  } else {
	    return createSimpleComponent(arg);
	  }
	}

	module.exports = Component;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function isNativeEvent(eventname) {
	  return typeof document.body["on" + eventname] !== "undefined";
	}

	// http://stackoverflow.com/questions/3076679/javascript-event-registering-without-using-jquery
	function addEvent(el, eventType, handler) {
	  if (el.addEventListener) {
	    // DOM Level 2 browsers
	    el.addEventListener(eventType, handler, false);
	  } else if (el.attachEvent) {
	    // IE <= 8
	    el.attachEvent('on' + eventType, handler);
	  } else {
	    // ancient browsers
	    el['on' + eventType] = handler;
	  }
	}

	function removeEvent(el, eventType, handler) {
	  if (el.removeEventListener) {
	    // DOM Level 2 browsers
	    el.removeEventListener(eventType, handler, false);
	  } else if (el.attachEvent) {
	    // IE <= 8
	    el.detachEvent('on' + eventType, handler);
	  }
	}

	var validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

	// http://stackoverflow.com/questions/10865025/merge-flatten-a-multidimensional-array-in-javascript
	function flatten(arr) {
	  return arr.reduce(function (flat, toFlatten) {
	    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	  }, []);
	}

	/**
	 */
	function SimpleDOM() {
	  this.props = this.getDefaultProps();
	  this.refs = {};
	}

	SimpleDOM.prototype = Object.create(SimpleDOM.prototype);

	SimpleDOM.prototype.getDefaultProps = function () {
	  return {};
	};

	SimpleDOM.prototype.emit = function (name) {
	  var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (this.emitter) {
	    this.emitter.emit(name, data, this);
	  }
	};

	SimpleDOM.prototype.render = function () {
	  throw "Render function is not implemented";
	};

	SimpleDOM.prototype.init = function () {};

	SimpleDOM.prototype.componentDidMount = function () {};

	SimpleDOM.prototype.componentWillUpdate = function () {};

	SimpleDOM.prototype.componentDidUpdate = function () {};

	SimpleDOM.prototype.componentWillUnmount = function () {};

	SimpleDOM.prototype.componentDidUnmount = function () {};

	SimpleDOM.prototype.setState = function (newState) {
	  if (this.state) {
	    Object.assign(this.state, newState);
	  }
	  this.forceUpdate();
	};

	SimpleDOM.prototype.setProps = function (newProps) {
	  Object.assign(this.props, newProps);
	  this.forceUpdate();
	};

	SimpleDOM.prototype.forceUpdate = function () {
	  this.componentWillUpdate();

	  this._render(this.element); // render element

	  this.componentDidUpdate();
	};

	SimpleDOM.prototype._render = function (oldElement) {
	  var sameLevel = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	  var d = null;
	  if (this.tagName) {
	    d = this;
	  } else {
	    d = this.render();
	  }
	  if (!d.tagName) {
	    this.element = d._render(oldElement, false);
	    if (sameLevel) {
	      this.componentWillUpdate();
	      this.props = d.props; // 'react' only changes props
	      this.componentDidUpdate();
	    }
	    d.componentDidMount();
	  } else if (d) {
	    this.element = this.diff(oldElement, d);
	  }
	  return this.element;
	};

	SimpleDOM.prototype.diff = function (element, d) {
	  if (element.tagName !== d.tagName) {
	    // different tag
	    var el = d._initialRender();
	    element.parentNode.replaceChild(el, element);
	    return el;
	  } else {
	    // set content
	    if (d.content) {
	      var node = element.firstChild;
	      if (node && node.nodeName === '#text') {
	        node.nodeValue = d.content;
	      } else {
	        element.insertBefore(document.createTextNode(d.content), node);
	      }
	    } else {
	      var _node = element.firstChild;
	      if (_node && _node.nodeName === '#text' && _node.nodeValue) {
	        _node.nodeValue = '';
	      }
	    }

	    // set attributes
	    // for (let i = 0; i < element.attributes.length; i++) {
	    while (element.attributes.length > 0) {
	      element.removeAttribute(element.attributes[0].name);
	    }

	    var eventsLength = 0,
	        _eventListeners = element._eventListeners || {},
	        events = {},
	        findEvent = false;

	    if (d.attributes) {
	      for (var key in d.attributes) {
	        var val = d.attributes[key];
	        if (isNativeEvent(key)) {
	          findEvent = true;
	          if (_eventListeners[key] !== val) {
	            removeEvent(element, key, _eventListeners[key]);
	            addEvent(element, key, val);
	            // _eventListeners[key] = val
	            events[key] = val;
	          }
	        } else if (key === 'ref') {
	          this.owner.refs[val] = element;
	        } else if (key === 'style' && val.constructor === Object) {
	          for (var styleKey in val) {
	            element.style[styleKey] = val[styleKey];
	          }
	        } else {
	          element.setAttribute(key, val);
	        }
	      }
	    }

	    for (var _key in _eventListeners) {
	      if (!events[_key]) {
	        removeEvent(element, _key, _eventListeners[_key]);
	      }
	    }
	    _eventListeners = null;
	    if (findEvent) {
	      element._eventListeners = events;
	    } else {
	      element._eventListeners = undefined;
	    }

	    // diff children
	    if (element.children.length === d.children.length) {
	      for (var i = 0; i < element.children.length; i++) {
	        d.children[i]._render(element.children[i], true);
	      }
	    } else if (element.children.length > d.children.length) {
	      var _i = 0;
	      for (; _i < d.children.length; _i++) {
	        d.children[_i]._render(element.children[_i], true);
	      }
	      while (element.children.length !== d.children.length) {
	        element.removeChild(element.children[_i]);
	      }
	    } else {
	      // if (element.children.length < d.children.length) {
	      var _i2 = 0;
	      for (; _i2 < element.children.length; _i2++) {
	        d.children[_i2]._render(element.children[_i2], true);
	      }
	      for (; _i2 < d.children.length; _i2++) {
	        element.appendChild(d.children[_i2]._initialRender());
	      }
	    }
	    return element;
	  }
	};

	SimpleDOM.prototype.appendChildrenDOMElements = function (children) {
	  var _this = this;

	  if (!children.length) return;

	  children.forEach(function (child) {
	    if (child.constructor === Array) {
	      _this.appendChildrenDOMElements(child);
	    } else {
	      _this.element.appendChild(child._initialRender());
	    }
	  });
	};

	SimpleDOM.prototype.generateDOM = function () {
	  var _eventListeners = {},
	      eventLength = 0;

	  this.element = document.createElement(this.tagName);

	  if (this.content) {
	    this.element.appendChild(document.createTextNode(this.content));
	  }

	  if (this.attributes) {
	    for (var key in this.attributes) {
	      var val = this.attributes[key];
	      if (isNativeEvent(key)) {
	        addEvent(this.element, key, val);
	        _eventListeners[key] = val;
	        eventLength += 1;
	      } else if (key === 'ref') {
	        this.owner.refs[val] = this.element;
	      } else if (key === 'style' && val.constructor === Object) {
	        for (var styleKey in val) {
	          this.element.style[styleKey] = val[styleKey];
	        }
	      } else {
	        this.element.setAttribute(key, val);
	      }
	    }
	  }

	  if (eventLength) {
	    this.element._eventListeners = _eventListeners; // HACK
	  }

	  this.appendChildrenDOMElements(this.children);

	  return this.element;
	};

	SimpleDOM.prototype._initialRender = function () {
	  if (this.tagName) {
	    // div ...
	    this.generateDOM();
	  } else {
	    var d = this.render();
	    if (d) {
	      this.element = d._initialRender();
	    }
	    this.componentDidMount();
	  }
	  return this.element;
	};

	// add tags

	var _loop = function _loop(i) {
	  SimpleDOM.prototype[validTags[i]] = function () {
	    var attributes = {},
	        content = null,
	        children = [];

	    var offset = 0;
	    if (arguments[offset] !== null && typeof arguments[offset] !== 'undefined' && arguments[offset].constructor === Object) {
	      attributes = arguments[offset];
	      offset += 1;
	    }

	    if (arguments[offset] !== null && typeof arguments[offset] !== 'undefined' && (arguments[offset].constructor === String || arguments[offset].constructor === Number)) {
	      content = arguments[offset];
	      offset += 1;
	    }

	    children = [];
	    function appendChildren(args) {
	      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      for (var _i3 = offset; _i3 < args.length; _i3++) {
	        if (args[_i3]) {
	          if (args[_i3].constructor === Array) {
	            appendChildren(args[_i3]);
	          } else {
	            children.push(args[_i3]);
	          }
	        }
	      }
	    }

	    appendChildren(arguments, offset);

	    var d = new SimpleDOM();
	    d.tagName = validTags[i].toUpperCase();
	    d.attributes = attributes;
	    d.content = content;
	    d.children = children;
	    d.owner = this;
	    d._eventListeners = {};
	    return d;
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	SimpleDOM.prototype.constructor = SimpleDOM;

	module.exports = SimpleDOM;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	/*
	 * Event emitter class
	 */

	var emitters = {};

	function Emitter() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  this.subscriptions = {};
	  this.id = null;

	  if (initialState.constructor === Function) {
	    var initFunc = initialState;
	    this.state = initialState;
	    initFunc.call(this);
	  } else {
	    this.state = initialState;
	  }
	}

	Emitter.prototype.constructor = Emitter;

	Emitter.prototype.registerId = function (id) {
	  if (emitters[id]) {
	    throw 'Error: ' + id + ' is already registered in Emitters';
	  } else {
	    this.id = id;
	    emitters[id] = this;
	  }
	};

	Emitter.getEmitterById = function (id) {
	  return emitters[id];
	};

	// emitter.emit()
	Emitter.prototype.emit = function (name) {
	  var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  var sender = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  if (this.subscriptions[name]) {
	    this.subscriptions[name].call(this, data, sender);
	  }
	};

	// emitter.on()
	// callback should be
	// - function(data, component) {
	//   }
	Emitter.prototype.on = function () {
	  if (arguments.length === 2) {
	    var name = arguments[0],
	        callback = arguments[1];
	    if (this.subscriptions[name]) {
	      throw 'Error: ' + name + ' is already registered in Emitter object';
	    } else {
	      this.subscriptions[name] = callback;
	    }
	  } else {
	    var obj = arguments[0];
	    for (var _name in obj) {
	      this.on(_name, obj[_name]);
	    }
	  }
	};

	// unsubscript the event
	Emitter.prototype.off = function (name) {
	  this.subscriptions[name] = null;
	};

	Emitter.prototype.destroy = function () {
	  this.state = {};
	  this.subscriptions = {};
	};

	/*
	Emitter.prototype.getState = function() {
	  return this.state
	}
	*/

	module.exports = Emitter;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Simple = __webpack_require__(1);

	var _Simple2 = _interopRequireDefault(_Simple);

	var _api = __webpack_require__(6);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var emitter = _Simple2.default.createEmitter({});

	emitter.on('search', function (_ref, component) {
	  var query = _ref.query;
	  var size = _ref.size;
	  var page = _ref.page;

	  _api2.default.search({ query: query, size: size, page: page }, function (res) {
	    component.stopTimer();
	    component.setProps({ counts: res.counts, results: res.result, searching: false, page: page });
	  });
	});

	emitter.on('recommend', function (_ref2, component) {
	  var keywords = _ref2.keywords;

	  _api2.default.recommend({ keywords: keywords }, function (res) {
	    var results = res.result;
	    if (typeof results === 'string') {
	      results = [];
	    }
	    component.stopTimer();
	    component.setProps({ results: results, isRecommendation: true, searching: false, counts: res.counts });
	  });
	});

	exports.default = emitter;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var api = {
	  search: function search(_ref, callback) {
	    var query = _ref.query;
	    var size = _ref.size;
	    var page = _ref.page;

	    $.ajax('/search', {
	      type: 'GET',
	      dataType: 'json',
	      data: { query: query, size: size, page: page },
	      success: function success(res) {
	        if (res) {
	          if (callback) callback(res);else callback(null);
	        } else if (callback) {
	          callback(null);
	        }
	      },
	      error: function error(res) {
	        if (callback) callback(null);
	      }
	    });
	  },
	  recommend: function recommend(_ref2, callback) {
	    var keywords = _ref2.keywords;

	    $.ajax('/recommend', {
	      type: 'GET',
	      dataType: 'json',
	      data: { keywords: keywords },
	      success: function success(res) {
	        if (res) {
	          if (callback) callback(res);else callback(null);
	        } else if (callback) {
	          callback(null);
	        }
	      },
	      error: function error(res) {
	        if (callback) callback(null);
	      }
	    });
	  }
	};

	exports.default = api;

/***/ }
/******/ ]);