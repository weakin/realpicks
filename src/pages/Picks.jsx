import React from 'react'
import ajax from 'superagent'
import Pick from './Pick'

class Picks extends React.Component {
  constructor (props) {
    super(props)

    this.state = {group: this.props.group, week: '', gameWeekAlias: '', users: [], weeksGames: [], picks: {}, currentWeek: 0, requestedWeek: 0, viewedPicks: [], viewedPicksObjects: []}

    this.fetchPicksInfo = this.fetchPicksInfo.bind(this)
    this.renderGamePicks = this.renderGamePicks.bind(this)
    this.navClickHandler = this.navClickHandler.bind(this)
    this.addWindowListener = this.addWindowListener.bind(this)
  }

  componentDidMount () {
    this.fetchPicksInfo(this.props.params.week)
    this.addWindowListener()
  }

  addWindowListener () {
    let viewedPicks = this.state.viewedPicks
    let viewedPicksObjects = this.state.viewedPicksObjects
    let thisHack = this
    window.addEventListener('popstate', function (e) {
      let pickRegEx = /picks\/(\d{1,2})/
      let foundPickWeek = document.URL.match(pickRegEx)
      let foundPickWeekInt = foundPickWeek !== null ? Number(foundPickWeek[1]) : null
      if (viewedPicks.indexOf(foundPickWeekInt) > -1) {
        thisHack.setState(viewedPicksObjects[foundPickWeekInt])
      } else if (foundPickWeekInt === null) {
        thisHack.setState(viewedPicksObjects[viewedPicks[0]])
      }
    })
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
            let emptyObject = {picks: null, week: null, users: null, weeksGames: null, currentWeek: response.body.current_week, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias}
            this.state.viewedPicksObjects[pickWeekInt] = emptyObject
            this.setState(emptyObject)
            return
          }

          let week = response.body.week_and_users.shift()
          let users = response.body.week_and_users.sort()
          let weeksGames = response.body[week]
          let pickObject = {picks: response.body.picks, week: week, users: users, weeksGames: weeksGames, currentWeek: response.body.current_week, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias}
          this.state.viewedPicksObjects[pickWeekInt] = pickObject
          this.setState(pickObject)
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  navClickHandler (weekInt) {
    this.fetchPicksInfo(weekInt)
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
      allPicks = <div className='noPicks'>No user has made Picks for this week!</div>
    } else {
      allPicks = boo.map((b, i) => {
        return <Pick caller='picksRow' picks={b} key={'pick' + String(i)} />
      })
    }

    return <div className='picks'>
      <Pick caller='header' headerArray={keys} requestedWeek={this.state.requestedWeek} currentWeek={this.state.currentWeek} gameWeekAlias={this.state.gameWeekAlias} navClickHandler={this.navClickHandler} />
      {allPicks}
    </div>
  }

}

export default Picks
