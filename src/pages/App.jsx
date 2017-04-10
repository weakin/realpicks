import React from 'react'
import ajax from 'superagent'

// Top level menu lives in List.jsx
import List from './List'

// the following line is so webpack will pull in the css file
import 'file-loader!../assets/css/base.css'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = { authorized: false }
    this.destructureQueryObject = this.destructureQueryObject.bind(this)
  }

  componentWillMount () {
    this.destructureQueryObject()
  }
  /*
  ** For this version of the site because there is no secure information being stored in the database,
  ** just the users picks for each week, I'm not using a secure log-in. The users credentials are being passed in
  ** on the querystring, validated against the database and stored for the session in a cookie. The cookie will
  ** expire when the user closes the browser. I check for the cookie first because a cookie means it's a valid user.
  */
  destructureQueryObject () {
    let cookieObj = this.checkCookie(document.cookie)
    let cookieObjKeys = Object.keys(cookieObj)
    let query = this.props.location.query
    if (Object.getOwnPropertyNames(this.props.location.query).length === 0 && cookieObjKeys.length === 0) {
      return // <- no info on the querystring, and no cookie, so not a registered user
    } else if (Object.getOwnPropertyNames(this.props.location.query).length === 0 && cookieObjKeys.length !== 0) {
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) { // <- the cookie object has the correct keys and they're not empty, so check if the user has made picks
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    if (this.props.location.query.hasOwnProperty('user') === false || this.props.location.query.hasOwnProperty('group') === false && cookieObjKeys.length === 0) {
      return // <- no cookie, and if there is something on the querystring it's not a valid user, so not a registered user
    } else if (this.props.location.query.hasOwnProperty('user') === false || this.props.location.query.hasOwnProperty('group') === false && cookieObjKeys.length !== 0) {
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) { // <- the cookie object has the correct keys and they're not empty, so check if the user has made picks
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    if (query.user.trim() === '' || query.group.trim() === '' && cookieObjKeys.length === 0) {
      return // <- the querystring has the correct keys, but they're empty, and no cookie, so not a registered user
    } else if (query.user.trim() === '' || query.group.trim() === '' && cookieObjKeys.length !== 0) { // <- the querystring has the correct keys, but they're empty, but there is a cookie
      if (cookieObj.name.length > 0 && cookieObj.group.length > 0) { // <- the cookie object has the correct keys and they're not empty, so check if the user has made picks
        this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
        return
      }
    }
    // The querystring and the cookie match, so check if the user has made picks
    if (query.user.trim() === cookieObjKeys.name && query.group.trim() === cookieObjKeys.group) {
      this.hasUserMadePicks(cookieObj.name, cookieObj.group, cookieObj.user_id, Boolean(cookieObj.authorized), cookieObj.sortParams)
      return
    }
    // If we got this far, there are the correct keys on the querystring, and they're not empty
    this.validateUser(query.user, query.group)
  }

  validateUser (user, group) {
    let baseURL = 'assets/php/getUserId.php'
    let sortParams = 'user=' + user + '&group=' + group
    ajax.get(`${baseURL}?${sortParams}`)
      .end((error, response) => {
        if (!error && response && response.body !== null) {
          /*
          ** There are two types of users, regular users, and Administrators. If the user is an admin, set state with
          ** that info. If it's a regular user, set the cookie, and check if the user has made picks.
          */
          if (response.body.name.trim() === 'admin') {
            this.setState({authorized: true, admin: true, user_id: Number(response.body.id)})
          } else {
            this.setCookie(user, group, Number(response.body.id), true)
            this.hasUserMadePicks(user, group, Number(response.body.id), true)
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
            this.setState({user: user, group: group, user_id: id, authorized: authorized, picks: false})
          } else {
            this.setState({user: user, group: group, user_id: id, authorized: authorized, picks: true})
          }
        } else {
          console.log('hasUserMadePicks: There was an error fetching data', error)
        }
      }
    )
  }

  /*
  ** Take the cookie, split it into it's key value pairs and put those into
  ** an array. Iterate over that array and build an object. Return the object
  ** the caller.
  */
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

  setCookie (user, group, id, authorized) {
    let cookieD = document.cookie
    if (cookieD.length === 0) {
      document.cookie = 'name=' + user
      document.cookie = 'group=' + group
      document.cookie = 'user_id=' + id
      document.cookie = 'authorized=' + authorized
      return
    }
  }

  render () {
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
