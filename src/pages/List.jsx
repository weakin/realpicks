import React from 'react'
import {Link} from 'react-router'

class List extends React.Component {
  render () {
    if (this.props.authorized === true) {
      return (
        <div className={this.props.authorized}>
          <ul>
            <li><Link to='/'>Games</Link></li>
            <li><Link to='/teams'>Teams</Link></li>
            <li><Link to='/standings'>Standings</Link></li>
            <li><Link to='/rankings'>Rankings</Link></li>
            <li><Link to='/picks'>Picks</Link></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className={this.props.authorized}>
          <ul>
            <li><Link to='/'>Games</Link></li>
            <li><Link to='/teams'>Teams</Link></li>
            <li><Link to='/standings'>Standings</Link></li>
          </ul>
        </div>
      )
    }
  }
}

export default List
