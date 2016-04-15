import React from 'react'
import ReactDOM from 'react-dom'


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <div className="app">
      <div className="container">
        <div className="pic"> </div>
        <input />
        <div className="search-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored"> Search </div>
      </div>
    </div>
  )
  }
}


ReactDOM.render(
  <App> </App>,
  document.getElementById('app')
)
