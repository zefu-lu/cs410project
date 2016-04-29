import Simple from './Simple/Simple.js'
import api from './api.js'

let emitter = Simple.createEmitter({
})

emitter.on('search', function({query, size, page}, component) {
  console.log('sent')
  api.search({query, size, page}, function(res) {
    console.log(res)
    component.setProps({count: res.count, results: res.result})
  })
})

export default emitter
