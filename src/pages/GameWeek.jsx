import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

import Game from './Game'
import Header from './Header'

class GameWeek extends React.Component {
  constructor (props) {
    super(props)

    this.state = {schedule: [], game_week: 0, game_week_alias: '', viewedWeeks: [], viewedWeekObjects: []}

    this.fetchWeekInfo = this.fetchWeekInfo.bind(this)

    this.addWindowListener = this.addWindowListener.bind(this)

    this.scrollToTop = this.scrollToTop.bind(this)
  }

  componentDidMount () {
    this.fetchWeekInfo(this.props.params.week)
    this.addWindowListener()
  }

  addWindowListener () {
    let viewedWeeks = this.state.viewedWeeks
    let viewedWeekObjects = this.state.viewedWeekObjects
    let thisHack = this
    window.addEventListener('popstate', function (e) {
      let gameWeekRegEx = /games\/(\d{1,2})/
      let foundGameWeek = document.URL.match(gameWeekRegEx)
      let foundGameWeekInt = foundGameWeek !== null ? Number(foundGameWeek[1]) : null
      if (viewedWeeks.indexOf(foundGameWeekInt) > -1) {
        thisHack.setState(viewedWeekObjects[foundGameWeekInt])
      } else if (foundGameWeekInt === null) {
        thisHack.setState(viewedWeekObjects[viewedWeeks[0]])
      }
      thisHack.scrollToTop()
    })
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
    this.scrollToTop()
  }

  scrollToTop () {
    $('html,body').animate({
      scrollTop: $('html,body').top
    }, 'slow')
  }

  render () {
    let backLink = this.state.back !== undefined && this.state.back >= 1 ? <span className='back'><Link to={`/games/${this.state.back}`} onClick={() => this.fetchWeekInfo(this.state.back)}>&lt;&lt;</Link></span> : <span className='back'>{String.fromCharCode(160)}</span>
    let forwardLink = this.state.forward !== undefined && this.state.forward <= 21 && this.state.forward !== '' ? <span className='forward'><Link to={`/games/${this.state.forward}`} onClick={() => this.fetchWeekInfo(this.state.forward)}>&gt;&gt;</Link></span> : <span className='forward'>{String.fromCharCode(160)}</span>
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
