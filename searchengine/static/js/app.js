import Simple from './Simple/Simple.js'
import emitter from './emitter.js'

let KEYWORDS = {}
if (window.localStorage.keywords) {
  KEYWORDS = JSON.parse(window.localStorage.keywords)
}

let Card = Simple.Component({
  showHTML: function() {
    window.open(this.props.link, '_blank')
  },
  render: function() {
    return this.div({class: 'card', click: this.showHTML.bind(this)},
              this.p({class: 'title'}, this.props.title),
              this.a({class: 'link', href: this.props.link}, this.props.link.slice(0, 64) + '...'))
  }
})

let Result = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {
      isRecommendation: false,
      query: '',
      counts: 0,
      results: [],
      searching: true,
      time: 0,
      page: 0
    }
  },
  search: function() {
    let query = this.refs.search.value.trim()
    if (!query.length) return
    this.props.query = query
    let page = 0,
        size = 10

    this.props.searching = true
    this.emit('search', {query, size, page})

    // save to KEYWORDS
    KEYWORDS[query] = true
    window.localStorage.keywords = JSON.stringify(KEYWORDS)

    this.props.time = 0
    this.interval = setInterval(()=>{
      this.props.time += 0.01
    }, 10)

    this.setProps({isRecommendation: false})
  },
  componentDidMount: function() {
    if (!this.props.isRecommendation && this.props.query) {
      let query = this.props.query.toLowerCase(),
          size = 10,
          page = 0

      this.props.searching = true
      this.emit('search', {query, size, page})

      // save to KEYWORDS
      KEYWORDS[query] = true
      window.localStorage.keywords = JSON.stringify(KEYWORDS)

      this.props.time = 0
      this.interval = setInterval(()=>{
        this.props.time += 0.01
      }, 10)
    } else {
      this.recommend()
    }
  },
  stopTimer: function() {
    clearInterval(this.interval)
  },
  searchPage: function(page) {
    let query = this.props.query.toLowerCase(),
        size = 10

    this.props.searching = true
    this.emit('search', {query, size, page})
  },
  onInput: function(event) {
    if (event.keyCode === 13) {
      this.search()
    }
  },
  recommend: function() {
    this.refs.search.value = ''
    this.emit('recommend', {keywords: Object.keys(KEYWORDS).join('\n')})

    this.props.time = 0
    this.interval = setInterval(()=>{
      this.props.time += 0.01
    }, 10)

    this.setProps({searching: true, isRecommendation: true})
  },
  render: function() {
    let results = []
    if (typeof(this.props.results) === 'string') { // not found
      results = null
      this.props.counts = 0
    } else {
      results = this.props.results.map((d) => {
        return Card({title: d[1], link: d[2]})
      })
    }

    let pagesList = []
    if (!this.props.searching && this.props.counts && !this.props.isRecommendation) {
      for (let i = 0; i < Math.ceil(this.props.counts / 10); i++) {
        pagesList.push(this.span({class: `page ${this.props.page === i ? 'selected' : ''}`, click: this.searchPage.bind(this, i)}, (i+1)))
      }
    }

    return this.div({class: 'result-page'},
            this.div({class: 'search-div'},
              this.div({class: 'pic-div'},
                this.img({class: 'pic', click: ()=> {location.reload()}, src:'./images/Lus-Garden.png'})),
              this.div({class: 'search-box-div'},
                this.input({class: 'search-box', value: this.props.query, ref: 'search', keyup: this.onInput.bind(this)}),
                this.button({class: 'mdl-button mdl-js-button mdl-button--icon', style: {marginLeft: '8px'}, click: this.search.bind(this)},
                  this.i({class: 'material-icons'}, 'search')),
                this.button({class: 'mdl-button mdl-js-button mdl-button--icon', click: this.recommend.bind(this)},
                  this.i({class: 'material-icons'}, 'mood')))),

            (this.props.isRecommendation ?
            this.div({class: 'results'},
              this.p({class: 'intro'}, this.props.searching? 'recommending...' : `${this.props.counts} results found in ${this.props.time.toFixed(4)}`),
              results,
              null)
            :
            this.div({class: 'results'},
              this.p({class: 'intro'}, this.props.searching? 'searching...' : `${this.props.counts} results found in ${this.props.time.toFixed(4)}`),
              results,
              (!this.props.searching ?
              this.div({class: 'pages-list'},
                pagesList)
              : null ))))
  }
})

let App = Simple.Component({
  init: function() {
    /*
     *   MAIN_PAGE
     *   RECOMMENDATION_RESULT
     *   SEARCH_RESULT
     */
    this.state = {page: 'MAIN_PAGE'}
  },
  showRecommendationResult: function() {
    this.setState({page: 'RECOMMENDATION_RESULT'})
  },
  onInput: function(event) {
    if (event.keyCode === 13) {
      this.showSearchResult()
    }
  },
  showSearchResult: function() {
    if (!this.refs.search.value.trim().length) return
    this.setState({page: 'SEARCH_RESULT', query: this.refs.search.value})
  },
  render: function() {
    if (this.state.page === 'MAIN_PAGE') {
      return this.div({class: 'app'},
              this.div({class: 'container'},
                this.div({class: 'pic'}),
                this.input({ref: 'search', autofocus: 'true', keyup: this.onInput.bind(this)}),
                this.div({class: 'button-group'},
                  this.div({class: 'search-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showSearchResult.bind(this)}, 'Search'),
                  this.div({class: 'lucky-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showRecommendationResult.bind(this)}, 'Feeling Lucky'))))
    } else if (this.state.page === 'RECOMMENDATION_RESULT') {
      return Result({isRecommendation: true, query: ''})
    } else if (this.state.page === 'SEARCH_RESULT') {
      return Result({isRecommendation: false, query: this.state.query})
    } else {
      throw 'Wrong Page'
    }
  }
})

let app = App()
Simple.render(app, document.getElementById('app'))
