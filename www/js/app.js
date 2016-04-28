import Simple from './Simple/Simple.js'


let data = [['56fc22ccdb366837f50cc6bd',
              'The inside story of the Paris terror attack',
              'http://rss.cnn.com/c/35492/f/676961/s/4e9b3442/sc/13/l/0L0Scnn0N0C20A160C0A30C30A0Ceurope0Cinside0Eparis0Ebrussels0Eterror0Eattacks0Cindex0Bhtml0Deref0Frss0Itopstories/story01.htm',
              67.324403599537],
             ['56fc088cdb366837f50cc650',
              'The inside story of the Paris terror attack',
              'http://rss.cnn.com/c/35492/f/676954/s/4e9b041d/sc/13/l/0L0Scnn0N0C20A160C0A30C30A0Ceurope0Cinside0Eparis0Ebrussels0Eterror0Eattacks0Cindex0Bhtml0Deref0Frss0Ilatest/story01.htm',
              67.324403599537],
             ['57008715db366837f50cd45c',
              'The inside story of the Paris terror attack',
              'http://rss.cnn.com/c/35492/f/676965/s/4e9b24c8/sc/13/l/0L0Scnn0N0C20A160C0A30C30A0Ceurope0Cinside0Eparis0Ebrussels0Eterror0Eattacks0Cindex0Bhtml0Deref0Frss0Iworld/story01.htm',
              67.324403599537],
             ['56fbdc53db366837f50cc577',
              "Inside the Paris attacker's inner circle",
              'http://rss.cnn.com/c/35492/f/676965/s/4e8f5b1c/sc/13/l/0L0Scnn0N0C20A160C0A30C280Ceurope0Cparis0Eattacker0Einner0Ecircle0Cindex0Bhtml0Deref0Frss0Iworld/story01.htm',
              61.92838781594857],
             ['56fd362edb366837f50cca5a',
              'Victims of Paris attacks offer help, hope to Brussels',
              'http://rss.cnn.com/c/35492/f/676965/s/4ea20e5e/sc/13/l/0L0Scnn0N0C20A160C0A30C310Ceurope0Cparis0Eattacks0Evictims0Emessages0Efor0Ebrussels0Cindex0Bhtml0Deref0Frss0Iworld/story01.htm',
              30.58452038782736],
             ['56fd106cdb366837f50cc978',
              'Victims of Paris attacks offer help, hope to Brussels',
              'http://rss.cnn.com/c/35492/f/676954/s/4e9ec7b3/sc/13/l/0L0Scnn0N0C20A160C0A30C310Ceurope0Cparis0Eattacks0Evictims0Emessages0Efor0Ebrussels0Cindex0Bhtml0Deref0Frss0Ilatest/story01.htm',
              30.58452038782736],
             ['56fbdc52db366837f50cc575',
              "Looking into the face of a bomber: 'He was not at ease'",
              'http://rss.cnn.com/c/35492/f/676965/s/4e9b24c5/sc/26/l/0L0Scnn0N0C20A160C0A30C30A0Cworld0Cparis0Eattacks0Ebley0Emokono0Esurvivor0Cindex0Bhtml0Deref0Frss0Iworld/story01.htm',
              25.954515772847756],
             ['56fc088ddb366837f50cc651',
              "Looking into the face of a bomber: 'He was not at ease'",
              'http://rss.cnn.com/c/35492/f/676954/s/4e9b2c71/sc/14/l/0L0Scnn0N0C20A160C0A30C30A0Cworld0Cparis0Eattacks0Ebley0Emokono0Esurvivor0Cindex0Bhtml0Deref0Frss0Ilatest/story01.htm',
              25.937155505752127],
             ['56fc22c9db366837f50cc6bc',
              "Looking into the face of a bomber: 'He was not at ease'",
              'http://rss.cnn.com/c/35492/f/676961/s/4e9bfe6c/sc/26/l/0L0Scnn0N0C20A160C0A30C30A0Cworld0Cparis0Eattacks0Ebley0Emokono0Esurvivor0Cindex0Bhtml0Deref0Frss0Itopstories/story01.htm',
              25.937155505752127],
             ['5703083cdb366837f50cdbaa',
              'Tracking ISIS ambitions in Europe',
              'http://rss.cnn.com/c/35492/f/676954/s/4eb20dc2/sc/47/l/0L0Scnn0N0C20A160C0A40C0A30Ceurope0Ctracking0Eisis0Eambitions0Ein0Eeurope0Cindex0Bhtml0Deref0Frss0Ilatest/story01.htm',
              24.501809517256046]]

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
  getDefaultProps: function() {
    return {
      recommdation: false,
      query: ''
    }
  },
  render: function() {
    let results = data.map((d) => {
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
              this.p({class: 'intro'}, '10 results found'),
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
    console.log('show recommendation')
    this.setState({page: 'RECOMMENDATION_RESULT'})
  },
  showSearchResult: function() {
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
                  this.div({class: 'lucky-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored', click: this.showRecommendationResult.bind(this)}, '百度一下'))))
    } else if (this.state.page === 'RECOMMENDATION_RESULT') {
      return Result({recommdation: true})
    } else if (this.state.page === 'SEARCH_RESULT') {
      return Result({recommdation: false, query: this.state.query})
    } else {
      throw 'Wrong Page'
    }
  }
})

let app = App()
Simple.render(app, document.getElementById('app'))
