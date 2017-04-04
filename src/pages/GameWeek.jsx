import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

import Game from './Game'
import Header from './Header'

class GameWeek extends React.Component {
  constructor (props) {
    super(props)

    this.state = {schedule: [], game_week: 0, current_week: 0, game_week_alias: '', viewedWeeks: [], viewedWeekObjects: []}
    this.fetchWeekInfo = this.fetchWeekInfo.bind(this)
    this.hashChangeListener = this.hashChangeListener.bind(this)
  }

  componentDidMount () {
    this.fetchWeekInfo(this.props.params.week)
    this.state.viewedWeeks = this.state.viewedWeeks.splice(0)
    window.addEventListener('hashchange', this.hashChangeListener, false)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.hashChangeListener, false)
  }

  hashChangeListener () {
    console.log('GameWeek.jsx - addEventListener - if block: 1')
    let gameWeekRegEx = /games\/(\d{1,2})/
    let foundGameWeek = document.URL.match(gameWeekRegEx)
    let foundGameWeekInt = foundGameWeek !== null ? Number(foundGameWeek[1]) : null
    if (this.state.viewedWeeks.indexOf(foundGameWeekInt) === -1 && foundGameWeekInt !== null && this.state.current_week !== (foundGameWeekInt + 1)) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is not one less than the current week int
      console.log('addEventListener - if block: 1')
      this.fetchWeekInfo(foundGameWeekInt)
    } else if (this.state.viewedWeeks.indexOf(foundGameWeekInt) === -1 && foundGameWeekInt !== null && (this.state.current_week - 1) === foundGameWeekInt) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is one less than the current week int
      console.log('addEventListener - if block: 2')
      this.fetchWeekInfo(foundGameWeekInt)
    } else if (this.state.viewedWeeks.indexOf(this.state.current_week) === -1 && foundGameWeekInt === null && this.state.viewedWeeks.length > 0) {
      // the requested data has not been viewed, there is no integer from location.hash, and as there are no other weeks in memory, display the current week
      console.log('addEventListener - if block: 3')
      this.fetchWeekInfo(this.state.current_week)
    } else if (this.state.viewedWeeks.indexOf(this.state.current_week) > -1 && foundGameWeekInt === null) {
      // the requested data has already been viewed, is the current week, and there is no week integer coming in from location.hash, so update the state from the stored data 
      console.log('addEventListener - if block: 4')
      this.setState(this.state.viewedWeekObjects[this.state.current_week])
    } else if (this.state.viewedWeeks.indexOf(foundGameWeekInt) > -1) {
      console.log('addEventListener - if block: 5')
      // the requested data has already been viewed and is stored, so update the state from the stored data 
      this.setState(this.state.viewedWeekObjects[foundGameWeekInt])
    }
  }

  fetchWeekInfo (weekInt) {
    let week = ''
    if (weekInt !== undefined) {
      week = Number(weekInt)
    }
    let baseURL = 'assets/php/query.php?week='
    ajax.get(`${baseURL}${week}`)
      .end((error, response) => {
        if (!error && response) {
          let gameWeekInt = Number(response.body[0].game_week)
          if (this.state.viewedWeeks.indexOf(gameWeekInt) === -1) {
            this.state.viewedWeeks.push(gameWeekInt)
          }
          let back = Number(response.body[0].game_week) > 1 ? Number(response.body[0].game_week) - 1 : ''
          let forward = Number(response.body[0].game_week) < 21 ? Number(response.body[0].game_week) + 1 : ''
          let gameWeekObject = { game_week: Number(response.body[0].game_week), game_week_alias: response.body[0].game_week_alias.trim(), current_week: Number(response.body[0].current_week), schedule: response.body, back: back, forward: forward }
          this.state.viewedWeekObjects[gameWeekInt] = gameWeekObject
          this.setState(gameWeekObject)
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  render () {
    let backLink = this.state.back !== undefined && this.state.back >= 1 ? <span className='back'><Link to={`/games/${this.state.back}`} >&lt;&lt;</Link></span> : <span className='back'>{String.fromCharCode(160)}</span>
    let forwardLink = this.state.forward !== undefined && this.state.forward <= 21 && this.state.forward !== '' ? <span className='forward'><Link to={`/games/${this.state.forward}`} >&gt;&gt;</Link></span> : <span className='forward'>{String.fromCharCode(160)}</span>
    return (
      <div className='gameWeek'>
        {backLink}
        <Header caller='gameWeek' class='weekHeader' key={this.state.game_week} text={this.state.game_week_alias} />
        {forwardLink}
        <Game caller='gameWeek' games={this.state.schedule} gameWeek={this.state.game_week} currentWeek={this.state.current_week} parentProps={this.props} />
      </div>
    )
  }
}

//

export default GameWeek
