import React from 'react'
import ajax from 'superagent'

import List from './List'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = { authorized: false }
    this.destructureQueryObject = this.destructureQueryObject.bind(this)
  }

  componentWillMount () {
    this.destructureQueryObject()
  }

  destructureQueryObject () {
    let cookieObj = this.checkCookie(document.cookie)
    let cookieObjKeys = Object.keys(cookieObj)
    let user = ''
    let group = ''
    let query = this.props.location.query
    if (Object.getOwnPropertyNames(this.props.location.query).length === 0 && cookieObjKeys.length === 0) {
      return
    } else if (Object.getOwnPropertyNames(this.props.location.query).length === 0 && cookieObjKeys.length !== 0) {
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) {
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    if (this.props.location.query.hasOwnProperty('user') === false || this.props.location.query.hasOwnProperty('group') === false && cookieObjKeys.length === 0) {
      return
    } else if (this.props.location.query.hasOwnProperty('user') === false || this.props.location.query.hasOwnProperty('group') === false && cookieObjKeys.length !== 0) {
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) {
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    if (query.user.trim() === '' || query.group.trim() === '' && cookieObjKeys.length === 0) {
      return
    } else if (query.user.trim() === '' || query.group.trim() === '' && cookieObjKeys.length !== 0) {
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) {
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    if (query.user.trim() === cookieObjKeys.name && query.group.trim() === cookieObjKeys.group) {
      this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
      return
    }
    this.validateUser(query.user, query.group)
  }

  validateUser (user, group) {
    let baseURL = 'assets/php/getUserId.php'
    let sortParams = 'user=' + user + '&group=' + group
    ajax.get(`${baseURL}?${sortParams}`)
      .end((error, response) => {
        if (!error && response && response.body !== null) {
          if (response.body.name.trim() === 'admin') {
            this.setState({authorized: true, admin: true, user_id: Number(response.body.id), locationShim: sortParams})
          } else {
            this.setCookie(user, group, Number(response.body.id), true, sortParams)
            this.hasUserMadePicks(user, group, Number(response.body.id), true, sortParams)
          }
        } else {
          console.log('validateUser: There was an error fetching data', error)
        }
      }
    )
  }

  hasUserMadePicks (user, group, id, authorized, locationShim) {
    let baseURL = 'assets/php/has_user_made_picks.php'
    let sortParams = 'user_name=' + user + '&user_group=' + group + '&id=' + id
    ajax.get(`${baseURL}?${sortParams}`)
      .end((error, response) => {
        if (!error && response && response.body !== null) {
          if (Number(response.body[0].count) === 0) {
            this.setState({user: user, group: group, user_id: id, authorized: authorized, picks: false, locationShim: locationShim})
          } else {
            this.setState({user: user, group: group, user_id: id, authorized: authorized, picks: true, locationShim: locationShim})
          }
        } else {
          console.log('hasUserMadePicks: There was an error fetching data', error)
        }
      }
    )
  }

  checkCookie (cookieString) {
    let cookieObj = {}
    if (cookieString === undefined || cookieString.length === 0) {
      return cookieObj
    }
    let cookieArray = cookieString.split('; ')
    let cookieArrayLength = cookieArray.length
    let i = 0
    let tempArr = []
    for (i; i < cookieArrayLength; i++) {
      tempArr = cookieArray[i].split('=')
      cookieObj[tempArr[0]] = tempArr[1]
    }
    return cookieObj
  }

  setCookie (user, group, id, authorized, sortParams) {
    let cookieD = document.cookie
    if (cookieD.length === 0) {
      document.cookie = 'name=' + user
      document.cookie = 'group=' + group
      document.cookie = 'user_id=' + id
      document.cookie = 'authorized=' + authorized
      document.cookie = 'sortParams=' + sortParams
      return
    }
  }

  render () {
    console.log(this.props.children)
    return (
      <div>
        <div className='headerAndNav'>
          <div className='header'>Real Picks</div>
          <List authorized={this.state.authorized} />
        </div>
        {React.cloneElement(this.props.children, { ...this.state })}
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.node
}

export default App
