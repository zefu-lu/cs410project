import Simple from './Simple/Simple.js'
import api from './api.js'

let emitter = Simple.createEmitter({
})

emitter.on('search', function({query, size, page}, component) {
  api.search({query, size, page}, function(res) {
    component.stopTimer()
    component.setProps({counts: res.counts, results: res.result, searching: false, page})
  })
})

emitter.on('recommend', function({keywords}, component) {
  api.recommend({keywords}, function(res) {
    let results = res.result
    if (typeof (results) === 'string') {
      results = []
    }
    component.stopTimer()
    component.setProps({results, isRecommendation: true, searching: false, counts: res.counts})
  })
})

export default emitter
