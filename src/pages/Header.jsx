import React from 'react'
import { Link } from 'react-router'

class Header extends React.Component {
  render () {
    if (this.props.caller !== undefined && this.props.caller === 'gameWeek') {
      return <div key={this.props.key} className={this.props.class}>
        {this.props.text.trim()}
      </div>
    }
    return <div key={this.props.key} className={this.props.class}>
      <Link to={`/games/${this.props.gameWeek}`}>{this.props.text}</Link>
    </div>
  }
}

export default Header
