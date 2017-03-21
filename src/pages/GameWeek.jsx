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
    this.addHashchangeListener = this.addHashchangeListener.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.finishAndRefresh = this.finishAndRefresh.bind(this)
  }

  componentDidMount () {
    this.fetchWeekInfo(this.props.params.week)
    this.state.viewedWeeks = this.state.viewedWeeks.splice(0)
    this.addHashchangeListener()
  }

  finishAndRefresh () {
    let paramWeek = Number(this.props.params.week)
    if (this.state.game_week === this.state.current_week && this.props.params.week !== undefined && paramWeek !== this.state.game_week) {
      if (this.state.viewedWeeks.indexOf(paramWeek) > -1) {
        console.log('called finishandrefresh 1')
        console.log('this.state.game_week: ' + String(this.state.game_week))
        console.log('this.state.current_week: ' + String(this.state.current_week))
        console.log('this.props.params.week: ' + String(this.props.params.week))
        this.setState(this.state.viewedWeekObjects[paramWeek])
        return
      }
    } else if (this.state.game_week === this.state.current_week && this.props.params.week !== undefined && paramWeek === this.state.game_week) {
      if (this.state.viewedWeeks.indexOf(paramWeek) > -1) {
        console.log('called finishAndRefresh 2')
        this.setState(this.state.viewedWeekObjects[this.state.game_week])
        return
      }
    }
  }

  addHashchangeListener () {
    window.addEventListener('hashchange', function (e) {
      console.log('called addHashchangeListener: boo!')
      let gameWeekRegEx = /games\/(\d{1,2})/
      let foundGameWeek = document.URL.match(gameWeekRegEx)
      let foundGameWeekInt = foundGameWeek !== null ? Number(foundGameWeek[1]) : null
      if (this.state.viewedWeeks.indexOf(foundGameWeekInt) === -1 && foundGameWeekInt !== null && this.state.current_week !== (foundGameWeekInt + 1)) {
        this.fetchWeekInfo(foundGameWeekInt)
      } else if (this.state.viewedWeeks.indexOf(foundGameWeekInt) === -1 && foundGameWeekInt !== null && (this.state.current_week - 1) === foundGameWeekInt) {
        this.fetchWeekInfo(foundGameWeekInt)
      } else if (this.state.viewedWeeks.indexOf(foundGameWeekInt) === -1 && foundGameWeekInt === null && this.state.viewedWeeks !== null) {
        this.fetchWeekInfo(this.state.current_week)
      } else if (this.state.viewedWeeks.indexOf(foundGameWeekInt) > -1) {
        this.setState(this.state.viewedWeekObjects[foundGameWeekInt], () => { this.finishAndRefresh() })
      } else if (foundGameWeekInt === null) {
        this.setState(this.state.viewedWeekObjects[this.state.viewedWeeks[0]], () => { this.finishAndRefresh() })
      }
    }.bind(this))
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
          this.setState(gameWeekObject, () => { this.finishAndRefresh() })
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  scrollToTop () {
    $('html,body').animate({scrollTop: 0}, 1000)
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
