import React from 'react'
import ajax from 'superagent'

import Pick from './Pick'
import scrollToTop from '../assets/js/scrollToTop'

class Picks extends React.Component {
  constructor (props) {
    super(props)

    this.state = {group: this.props.group, week: '', gameWeekAlias: '', users: [], weeksGames: [], picks: {}, current_week: 0, requestedWeek: 0, viewedPicks: [], viewedPicksObjects: []}

    this.fetchPicksInfo = this.fetchPicksInfo.bind(this)
    this.renderGamePicks = this.renderGamePicks.bind(this)
    this.hashChangeListener = this.hashChangeListener.bind(this)
  }

  componentDidMount () {
    this.fetchPicksInfo(this.props.params.week)
    window.addEventListener('hashchange', this.hashChangeListener, false)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.hashChangeListener, false)
  }

  /*
  ** The hashChangeListener function works on the same idea in each component it's placed in.
  ** It listens for changes to location.hash and updates the component state accordingly. On initial load of the
  ** component, the componentDidMount calls the data fetching function. If a user is navigating
  ** within the component, each time a new data request comes back from the server it pushes the relevant
  ** data into a object on the component state that stores the data, and then updates an array on the
  ** component state that records that that specific data has been requested, and is in the data storage object.
  ** While still in the same component if the user requests data that has already been viewed,
  ** the hashChangeListener sees that the data is already on the data storage object on state
  ** and calls setState with the correct data. This prevents multiple API requests for the same data.
  ** If the data hasn't been requested yet, it calls the data fetching function.
  **
  ** As this function is found in four components (GameWeek, Picks, Rankings, and TeamSchedule) with just slight
  ** variations, it should be abstracted and moved up to the top level component. For now though, for each component
  ** the function is in it gets bound to the window by window.addEventListener when the component mounts and
  ** unbound when the component unmounts. If the window event listener wasn't removed when the component unmounted
  ** there could be four event listerners calling the same function each time the location.hash changed.
  */
  hashChangeListener () {
    let pickRegEx = /picks\/(\d{1,2})/
    let foundPickWeek = document.URL.match(pickRegEx)
    let foundPickWeekInt = foundPickWeek !== null ? Number(foundPickWeek[1]) : null
    if (this.state.viewedPicks.indexOf(foundPickWeekInt) === -1 && foundPickWeekInt !== null && this.state.current_week !== (foundPickWeekInt + 1)) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is not one less than the current week int
      this.fetchPicksInfo(foundPickWeekInt)
    } else if (this.state.viewedPicks.indexOf(foundPickWeekInt) === -1 && foundPickWeekInt !== null && (this.state.current_week - 1) === foundPickWeekInt) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is one less than the current week int
      this.fetchPicksInfo(foundPickWeekInt)
    } else if (this.state.viewedPicks.indexOf(this.state.current_week) === -1 && foundPickWeekInt === null && this.state.viewedPicks.length > 0) {
      // the requested data has not been viewed, there is no integer from location.hash, and as there are no other weeks in memory, display the current week
      this.fetchPicksInfo(this.state.current_week)
    } else if (this.state.viewedPicks.indexOf(this.state.current_week) > -1 && foundPickWeekInt === null) {
      // the requested data has already been viewed, is the current week, and there is no week integer coming in from location.hash, so update the state from the stored data
      this.setState(this.state.viewedPicksObjects[this.state.current_week])
    } else if (this.state.viewedPicks.indexOf(foundPickWeekInt) > -1) {
      // the requested data has already been viewed and is stored, so update the state from the stored data
      this.setState(this.state.viewedPicksObjects[foundPickWeekInt])
    }
    scrollToTop()
  }

  fetchPicksInfo (weekInt) {
    let week = 0
    if (weekInt !== undefined) {
      week = Number(weekInt)
    }
    let baseURL = 'assets/php/show_picks.php'
    ajax.get(`${baseURL}?week=${week}&group=${this.props.group}`)
      .end((error, response) => {
        if (!error && response) {
          let pickWeekInt = Number(response.body.requested_week)
          if (this.state.viewedPicks.indexOf(pickWeekInt) === -1) {
            this.state.viewedPicks.push(pickWeekInt)
          }
          if (response.body.week_and_users === undefined) {
            let emptyObject = {picks: null, week: null, users: null, weeksGames: null, current_week: response.body.current_week, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias}
            this.state.viewedPicksObjects[pickWeekInt] = emptyObject
            this.setState(emptyObject)
            return
          }

          let week = response.body.week_and_users.shift()
          let users = response.body.week_and_users.sort()
          let weeksGames = response.body[week]
          let pickObject = {picks: response.body.picks, week: week, users: users, weeksGames: weeksGames, current_week: response.body.current_week, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias}
          this.state.viewedPicksObjects[pickWeekInt] = pickObject
          this.setState(pickObject)
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  renderGamePicks (Obj) {
    let keys = []
    let gameKeyIndex = 0
    keys = Object.keys(Obj)
    gameKeyIndex = keys.indexOf('game')
    keys.splice(gameKeyIndex, 1)
    keys.sort()
    keys.unshift('game')
    return keys
  }

  render () {
    let boo = []
    let keysArr = []
    let firstKey = 0
    let keys = []
    let allPicks = ''
    let headerText = this.state.gameWeekAlias
    if (this.state.picks !== undefined && this.state.picks !== null) {
      keysArr = Object.keys(this.state.picks)
      firstKey = keysArr[0]
      if (this.state.picks[firstKey] !== undefined && this.state.picks[firstKey] !== null) {
        keys = this.renderGamePicks(this.state.picks[firstKey])
      }
    }
    if (this.state.picks !== undefined && this.state.picks !== null && keys.length >= 2) {
      for (let prop in this.state.picks) {
        boo.push(keys.map((key) => {
          if (key === 'game') {
            return [key, this.state.picks[prop][key]]
          }
          return [key, this.state.picks[prop][key].pick]
        }, this))
      }
    }

    if (boo.length === 0) {
      // if no user has made picks for this week, set the headerText to tell the user that, and set allPicks to an empty string
      headerText = 'No user has made Picks for this week!'
      allPicks = ''
    } else {
      allPicks = boo.map((b, i) => {
        return <Pick caller='picksRow' picks={b} key={'pick' + String(i)} />
      })
    }

    return <div className='picks'>
      <Pick caller='header' headerArray={keys} requestedWeek={this.state.requestedWeek} currentWeek={this.state.current_week} gameWeekAlias={headerText} />
      {allPicks}
    </div>
  }

}

export default Picks
