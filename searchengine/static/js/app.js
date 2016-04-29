import Simple from './Simple/Simple.js'
import emitter from './emitter.js'

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
      recommdation: false,
      query: '',
      count: 0,
      results: [],
      searching: true
    }
  },
  search: function() {

  },
  componentDidMount: function() {
    if (!this.props.recommdation && this.props.query) {
      let query = this.props.query.toLowerCase(),
          size = 10,
          page = 0
      this.emit('search', {query, size, page})
    }
  },
  render: function() {
    let results = this.props.results.map((d) => {
      return Card({title: d[1], link: d[2]})
    })

    return this.div({class: 'result-page'},
            this.div({class: 'search-div'},
              this.div({class: 'pic-div'},
                this.img({class: 'pic', click: ()=> {location.reload()}, src:'./images/Lus-Garden.png'})),
              this.div({class: 'search-box-div'},
                this.input({class: 'search-box', value: this.props.query}),
                this.button({class: 'mdl-button mdl-js-button mdl-button--icon', style: {marginLeft: '8px'}},
                  this.i({class: 'material-icons'}, 'search')),
                this.button({class: 'mdl-button mdl-js-button mdl-button--icon'},
                  this.i({class: 'material-icons'}, 'mood')))),
            this.div({class: 'results'},
              this.p({class: 'intro'}, this.props.searching? 'searching...' : '10 results found'),
              results,
              this.div({class: 'pages-list'},
                this.span({class: 'page'}, 1),
                this.span({class: 'page'}, 2)
              )))
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
  showSearchResult: function() {
    if (!this.refs.search.value.trim().length) return
    this.setState({page: 'SEARCH_RESULT', query: this.refs.search.value})
  },
  render: function() {
    if (this.state.page === 'MAIN_PAGE') {
      return this.div({class: 'app'},
              this.div({class: 'container'},
                this.div({class: 'pic'}),
                this.input({ref: 'search', autofocus: 'true'}),
                this.div({class: 'button-group'},
                  this.div({class: 'search-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showSearchResult.bind(this)}, 'Search'),
                  this.div({class: 'lucky-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showRecommendationResult.bind(this)}, 'Feeling Lucky'))))
    } else if (this.state.page === 'RECOMMENDATION_RESULT') {
      return Result({recommdation: true, query: ''})
    } else if (this.state.page === 'SEARCH_RESULT') {
      return Result({recommdation: false, query: this.state.query})
    } else {
      throw 'Wrong Page'
    }
  }
})

let app = App()
Simple.render(app, document.getElementById('app'))
