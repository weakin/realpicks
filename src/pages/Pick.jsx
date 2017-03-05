import React from 'react'
import {Link} from 'react-router'

class Pick extends React.Component {
  constructor (props) {
    super(props)

    this.state = {winner: ''}

    this.buildPicksRow = this.buildPicksRow.bind(this)
    this.buildHeaderRowNav = this.buildHeaderRowNav.bind(this)
    this.navClickHandler = this.navClickHandler.bind(this)
  }

  navClickHandler (navType) {
    let reqWeek = Number(this.props.requestedWeek)
    if (typeof this.props.navClickHandler === 'function') {
      if (navType === 'back') {
        this.props.navClickHandler(reqWeek - 1)
      } else if (navType === 'forward') {
        this.props.navClickHandler(reqWeek + 1)
      }
    }
  }

  buildHeaderRowNav (key, requestedWeekArg, currentWeekArg, gameWeekAlias) {
    let backArrow = ''
    let forwardArrow = ''
    let requestedWeek = Number(requestedWeekArg)
    let currentWeek = Number(currentWeekArg)
    backArrow = requestedWeek <= currentWeek && currentWeek >= 2 && requestedWeek >= 2 ? <Link to={`/picks/${Number(requestedWeek) - 1}`} onClick={() => this.navClickHandler('back')}>&lt;&lt;</Link> : ''
    forwardArrow = currentWeek <= 21 && requestedWeek < currentWeek ? <Link to={`/picks/${Number(requestedWeek) + 1}`} onClick={() => this.navClickHandler('forward')}>&gt;&gt;</Link> : ''
    return <span className='header' key={key}>{backArrow} {gameWeekAlias} {forwardArrow}</span>
  }

  buildPicksRow (picksArray) {
    let gameID = 0
    let homeTeam = ''
    let awayTeam = ''
    let winningTeam = ''
    // let losingTeam = ''
    let homeTeamScore = ''
    let awayTeamScore = ''
    let replaceSpace = /\s/gi
    let homeTeamImg = ''
    let awayTeamImg = ''
    let homeTeamResult = ''
    let awayTeamResult = ''
    let teams = {}
    gameID = Number(picksArray[0][1].id)
    homeTeam = picksArray[0][1].home_team.trim()
    awayTeam = picksArray[0][1].away_team.trim()
    teams[homeTeam] = {}
    teams[awayTeam] = {}
    homeTeamImg = homeTeam.toLowerCase().replace(replaceSpace, '')
    awayTeamImg = awayTeam.toLowerCase().replace(replaceSpace, '')
    winningTeam = picksArray[0][1].winning_team !== null ? picksArray[0][1].winning_team.trim() : ''
    // losingTeam = picksArray[0][1].losing_team !== null ? picksArray[0][1].losing_team.trim() : ''
    homeTeamResult = homeTeam === winningTeam ? 'homeTeam winner' : 'homeTeam'
    awayTeamResult = awayTeam === winningTeam ? 'awayTeam winner' : 'awayTeam'
    homeTeamScore = homeTeam === winningTeam ? picksArray[0][1].winning_score : picksArray[0][1].losing_score
    awayTeamScore = awayTeam === winningTeam ? picksArray[0][1].winning_score : picksArray[0][1].losing_score
    teams[homeTeam].winner = homeTeam === winningTeam ? 'pick winner' : 'pick'
    teams[awayTeam].winner = awayTeam === winningTeam ? 'pick winner' : 'pick'
    teams[homeTeam].winnerImg = homeTeamImg
    teams[awayTeam].winnerImg = awayTeamImg

    let picksRow = picksArray.map((p, i) => {
      if (p[0] === 'game') {
        return <span className='game' key={gameID + i}>
          <span className={awayTeamResult}>
            <img src={`assets/img/${awayTeamImg}.png`} alt={awayTeam} /><br />{awayTeamScore}
          </span>
          <b>@</b>
          <span className={homeTeamResult}>
            <img src={`assets/img/${homeTeamImg}.png`} alt={homeTeam} /><br />{homeTeamScore}
          </span>
        </span>
      }
      let teamClass = teams[p[1].trim()].winner
      let teamImg = teams[p[1].trim()].winnerImg
      let teamName = p[1].trim()
      return <span className={teamClass} key={gameID + i}>
        <img src={`assets/img/${teamImg}.png`} alt={teamName} />
        <span className='name'>{p[0].trim()}</span>
      </span>
    })
    return picksRow
  }

  render () {
    if (this.props.caller === 'header') {
      if (this.props.headerArray.length === 0) {
        return <div className='headerRow'>{this.buildHeaderRowNav(0, this.props.requestedWeek, this.props.currentWeek, this.props.gameWeekAlias)}</div>
      }
      let headers = []
      for (let i = 0; i < this.props.headerArray.length; i++) {
        if (i === 0) {
          headers.push(this.buildHeaderRowNav(i, this.props.requestedWeek, this.props.currentWeek, this.props.gameWeekAlias))
        } else {
          headers.push(<span className='header' key={i}>{this.props.headerArray[i]}</span>)
        }
      }
      return <div className='headerRow'>{headers}</div>
    } else {
      return <div className='gameRow'>{this.buildPicksRow(this.props.picks)}</div>
    }
  }
}

export default Pick
