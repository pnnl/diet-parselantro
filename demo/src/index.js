import React, {Component} from 'react'
import {render} from 'react-dom'

import {Example} from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>diet-parselantro-widget Demo</h1>
      <div>
        A Custom Jupyter Widget Library
      </div>
      <Example hello='world'/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
