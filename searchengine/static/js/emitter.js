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

export default emitter
