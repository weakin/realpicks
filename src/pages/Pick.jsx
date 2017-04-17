import React from 'react'
import {Link} from 'react-router'

class Pick extends React.Component {
  constructor (props) {
    super(props)

    this.state = {winner: ''}

    this.buildPicksRow = this.buildPicksRow.bind(this)
    this.buildHeaderRowNav = this.buildHeaderRowNav.bind(this)
  }

  buildHeaderRowNav (key, requestedWeekArg, currentWeekArg, gameWeekAlias) {
    let backArrow = ''
    let forwardArrow = ''
    let requestedWeek = Number(requestedWeekArg)
    let currentWeek = Number(currentWeekArg)
    gameWeekAlias = gameWeekAlias.length < 20 ? gameWeekAlias : <span className='navNarrow'>{gameWeekAlias}</span>
    backArrow = requestedWeek <= currentWeek && currentWeek >= 2 && requestedWeek >= 2 ? <Link to={`/picks/${Number(requestedWeek) - 1}`}>&lt;&lt;</Link> : ''
    forwardArrow = currentWeek <= 21 && requestedWeek < currentWeek ? <Link to={`/picks/${Number(requestedWeek) + 1}`}>&gt;&gt;</Link> : ''
    return <span className='header nav' key={key}>{backArrow} {gameWeekAlias} {forwardArrow}</span>
  }

  buildPicksRow (picksArray) {
    let gameID = 0
    let homeTeam = ''
    let awayTeam = ''
    let winningTeam = ''
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
      let header = this.buildHeaderRowNav(1, this.props.requestedWeek, this.props.currentWeek, this.props.gameWeekAlias)
      let headerRowClass = this.props.gameWeekAlias.length < 20 ? 'headerRow ' + this.props.additionalClass : 'headerRowNarrow ' + this.props.additionalClass
      return <div className={headerRowClass}>{header}</div>
    } else {
      return <div className='gameRow'>{this.buildPicksRow(this.props.picks)}</div>
    }
  }
}

export default Pick
