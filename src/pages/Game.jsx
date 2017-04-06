import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

class Game extends React.Component {
  constructor (props) {
    super(props)

    this.state = { byeWeekTeams: [], caller: this.props.caller, selectedGames: [], gameDayAndDate: [] }

    this.userSubmit = this.userSubmit.bind(this)
    this.removeGameFromSelectedGames = this.removeGameFromSelectedGames.bind(this)
    this.fixGameTime = this.fixGameTime.bind(this)
    this.dayAndDateHeader = this.dayAndDateHeader.bind(this)
  }

  render () {
    this.state.gameDayAndDate.splice(0, this.state.gameDayAndDate.length)
    if (this.props.caller === 'teamSchedule') {
      return <div>
        <span className='teamPageTitle'>{this.props.team}</span>
        {this.props.games.map((a) => { return this.renderGame(a) }, this)}
      </div>
    } else if (this.props.parentProps.authorized === true && this.props.parentProps.admin === true && this.props.caller !== 'teamSchedule') {
      return <div>
        {this.props.games.map((game) => {
          if (game.away_team_conference.trim() === '') {
            return ''
          }
          let gameWeek = <input type='hidden' name='game_week' value={game.current_week} />
          let homeTeam = <input type='hidden' name='home_team' value={game.home_team.trim()} />
          let awayTeam = <input type='hidden' name='away_team' value={game.away_team.trim()} />
          let homeTeamDivision = <input type='hidden' name='home_team_division' value={game.home_team_division.trim()} />
          let awayTeamDivision = <input type='hidden' name='away_team_division' value={game.away_team_division.trim()} />
          let homeTeamConference = <input type='hidden' name='home_team_conference' value={game.home_team_conference.trim()} />
          let awayTeamConference = <input type='hidden' name='away_team_conference' value={game.away_team_conference.trim()} />
          let gameId = <input type='hidden' name='id' value={game.id} />
          return <form onSubmit={() => this.adminSubmit(event, game.id)} className='adminForm' id={game.id}>{this.renderGame(game)}{gameWeek} {homeTeam} {awayTeam} {homeTeamDivision} {awayTeamDivision} {homeTeamConference} {awayTeamConference} {gameId}<span className='holder' /></form>
        }, this)}
      </div>
    } else {
      if (this.props.parentProps.authorized === true && this.props.parentProps.picks === false) {
        this.clearStateSelectedGamesArray()
        let button = this.props.currentWeek === this.props.gameWeek ? <button type='submit' value='Submit'>Submit &gt;&gt;</button> : ''
        return <form onSubmit={this.userSubmit} className='userForm'>
          {this.props.games.map((a) => { return this.renderGame(a) }, this)}
          <input type='hidden' name='week' value={this.props.gameWeek} />
          <input type='hidden' name='id' value={this.props.parentProps.user_id} />
          <input type='hidden' name='user_name' value={this.props.parentProps.user} />
          <input type='hidden' name='user_group' value={this.props.parentProps.group} />
          {button}
        </form>
      }
      return <div>{this.props.games.map((a) => { return this.renderGame(a) }, this)}</div>
    }
  }

  clearStateSelectedGamesArray () {
    this.state.selectedGames.splice(0)
    return
  }

  userSubmit (e) {
    e.preventDefault()
    if (this.state.selectedGames.length > 0) {
      this.scrollToFirstUnselectedGame(this.state.selectedGames[0])
      this.highlightUnselectedGames()
      return
    }

    let formData = $('.userForm').serialize()

    ajax.post('assets/php/insert_picks.php')
    .type('form')
    .send(formData)
    .end((err, res) => {
      if (err === null) {
        this.context.router.push('/picks')
      }
    })
  }

  adminSubmit (e, gameID) {
    e.preventDefault()

    let gameResultFormFields = this.generateWinningLosingTeamFormFields(gameID)
    let formData = ''
    let buttonID = ''
    let winningTeam = ''

    $('#' + gameID + ' .holder').empty()
    $('#' + gameID + ' .holder').append(gameResultFormFields)

    formData = $('#' + gameID).serialize()
    buttonID = 'button' + gameID
    winningTeam = $('#winning_team').val()

    ajax.post('assets/php/update_game.php')
    .type('form')
    .send(formData)
    .end((err, res) => {
      console.log(res.text)
    })
    ajax.post('assets/php/update_team_stats.php')
    .type('form')
    .send(formData)
    .end((err, res) => {
      console.log(res.text)
    })
    ajax.post('assets/php/update_team_records.php')
    .type('form')
    .send(formData)
    .end((err, res) => {
      console.log(res.text)
    })
    ajax.post('assets/php/update_team_scores.php')
    .type('form')
    .send(formData)
    .end((err, res) => {
      console.log(res.text)
    })
    if (winningTeam !== undefined) {
      ajax.get('assets/php/update_user_stats.php')
      .query({ id: gameID, winning_team: winningTeam })
      .end((err, res) => {
        console.log(res.text)
      })
    }

    $('#' + buttonID).detach()
    $('#' + gameID + ' > span.holder').detach()
  }

  generateWinningLosingTeamFormFields (gameID) {
    let homeTeam = ''
    let awayTeam = ''
    let homeTeamScore = ''
    let awayTeamScore = ''
    let homeTeamDivision = ''
    let awayTeamDivision = ''
    let homeTeamConference = ''
    let awayTeamConference = ''
    let winningTeam = ''
    let losingTeam = ''
    let winningTeamDivision = ''
    let losingTeamDivision = ''
    let winningTeamConference = ''
    let losingTeamConference = ''
    let winningScore = ''
    let losingScore = ''
    let allFields = ''
    let tie = ''
    let tieTeamOne = ''
    let tieTeamTwo = ''
    let tieScoreOne = ''

    homeTeam = $('#' + gameID + ' input[name=home_team]').val()
    awayTeam = $('#' + gameID + ' input[name=away_team]').val()
    homeTeamDivision = $('#' + gameID + ' input[name=home_team_division]').val()
    awayTeamDivision = $('#' + gameID + ' input[name=away_team_division]').val()
    homeTeamConference = $('#' + gameID + ' input[name=home_team_conference]').val()
    awayTeamConference = $('#' + gameID + ' input[name=away_team_conference]').val()
    homeTeamScore = $('#' + gameID + ' input[name=home_team_score]').val() !== '' ? Number($('#' + gameID + ' input[name=home_team_score]').val()) : 0
    awayTeamScore = $('#' + gameID + ' input[name=away_team_score]').val() !== '' ? Number($('#' + gameID + ' input[name=away_team_score]').val()) : 0

    if (homeTeamScore > awayTeamScore) {
      winningTeam = '<input type=\'hidden\' id=\'winning_team\' name=\'winning_team\' value=\'' + homeTeam + '\' />'
      winningTeamDivision = '<input type=\'hidden\' name=\'winning_team_division\' value=\'' + homeTeamDivision + '\' />'
      winningTeamConference = '<input type=\'hidden\' name=\'winning_team_conference\' value=\'' + homeTeamConference + '\' />'
      winningScore = '<input type=\'hidden\' name=\'winning_score\' value=\'' + homeTeamScore + '\' />'
      losingTeam = '<input type=\'hidden\' name=\'losing_team\' value=\'' + awayTeam + '\' />'
      losingTeamDivision = '<input type=\'hidden\' name=\'losing_team_division\' value=\'' + awayTeamDivision + '\' />'
      losingTeamConference = '<input type=\'hidden\' name=\'losing_team_conference\' value=\'' + awayTeamConference + '\' />'
      losingScore = '<input type=\'hidden\' name=\'losing_score\' value=\'' + awayTeamScore + '\' />'
    } else if (homeTeamScore < awayTeamScore) {
      winningTeam = '<input type=\'hidden\' id=\'winning_team\' name=\'winning_team\' value=\'' + awayTeam + '\' />'
      winningTeamDivision = '<input type=\'hidden\' name=\'winning_team_division\' value=\'' + awayTeamDivision + '\' />'
      winningTeamConference = '<input type=\'hidden\' name=\'winning_team_conference\' value=\'' + awayTeamConference + '\' />'
      winningScore = '<input type=\'hidden\' name=\'winning_score\' value=\'' + awayTeamScore + '\' />'
      losingTeam = '<input type=\'hidden\' name=\'losing_team\' value=\'' + homeTeam + '\' />'
      losingTeamDivision = '<input type=\'hidden\' name=\'losing_team_division\' value=\'' + homeTeamDivision + '\' />'
      losingTeamConference = '<input type=\'hidden\' name=\'losing_team_conference\' value=\'' + homeTeamConference + '\' />'
      losingScore = '<input type=\'hidden\' name=\'losing_score\' value=\'' + homeTeamScore + '\' />'
    } else if (homeTeamScore === awayTeamScore) {
      tieTeamOne = '<input type=\'hidden\' name=\'tie_team_1\' value=\'' + awayTeam + '\' />'
      tieTeamTwo = '<input type=\'hidden\' name=\'tie_team_2\' value=\'' + homeTeam + '\' />'
      tieScoreOne = '<input type=\'hidden\' name=\'tie_score_1\' value=\'' + awayTeamScore + '\' />'
      tie = '<input type=\'hidden\' name=\'tie\' value=\'true\' />'
      allFields = tieTeamOne + tieTeamTwo + tieScoreOne + tie
      return allFields
    }

    allFields = winningTeam + winningTeamDivision + winningTeamConference + winningScore + losingTeam + losingTeamDivision + losingTeamConference + losingScore

    return allFields
  }

  highlightUnselectedGames () {
    this.state.selectedGames.forEach((e) => {
      let id = '#' + e
      $(id).addClass('unselected')
    })
  }

  scrollToFirstUnselectedGame (gameID) {
    $('html,body').animate({
      scrollTop: $('#' + gameID).offset().top - 50
    }, 'slow')
  }

  removeGameFromSelectedGames (gameId) {
    let arrayPosition = this.state.selectedGames.indexOf(gameId)
    let id = '#' + gameId
    if (arrayPosition < 0) {
      return
    }
    $(id).removeClass('unselected')
    this.state.selectedGames.splice(arrayPosition, 1)
  }

  fixGameTime (sixDigitHour) {
    let timeArray = sixDigitHour.split(':')
    let hourAndMinute = []
    let fixedTime = ''
    let hour = timeArray[0]
    let minute = timeArray[1]
    if (Number(hour) > 12) {
      hour = String(Number(hour) - 12)
    }
    hourAndMinute = [String(hour), String(minute)]
    fixedTime = hourAndMinute.join(':')
    return fixedTime
  }

  dayAndDateHeader (gameDate, gameDayOfWeek) {
    let arrayPosition = this.state.gameDayAndDate.indexOf(gameDate)
    if (arrayPosition < 0) {
      this.state.gameDayAndDate.push(gameDate)
      return gameDayOfWeek.trim() + ', ' + gameDate.trim()
    }
    return ''
  }

  renderGame (game) {
    if (game.away_team_conference.trim() === '' && this.props.caller !== 'teamSchedule') {
      this.state.byeWeekTeams.push(game.home_team.trim())
      return
    }

    if (game.away_team_conference.trim() === '' && this.props.caller === 'teamSchedule') {
      return <div key={game.id}>
        <div className='scheduleWeekHeader'><Link to={`/games/${game.game_week}`}>{game.game_week_alias}</Link></div>
        Bye Week
      </div>
    }

    if (game.losing_score === null) {
      this.state.selectedGames.push(game.id)
    }

    let dayAndDateHeader = <div className='dayAndDateHeader'>{this.dayAndDateHeader(game.game_date, game.game_day_of_week)}</div>
    let awayTeam = game.away_team.trim()
    let homeTeam = game.home_team.trim()
    let weekHeader = this.props.caller === 'teamSchedule' ? <div className='scheduleWeekHeader'><Link to={`/games/${game.game_week}`}>{game.game_week_alias}</Link></div> : ''
    let replaceSpace = /\s/gi
    let divisionGame = game.away_team_division === game.home_team_division ? 'division' : ''
    let authorized = this.props.authorized !== undefined ? 'authorized' : ''
    let past = Number(this.props.currentWeek) > Number(this.props.gameWeek) ? 'past' : ''
    let disabled = Number(this.props.currentWeek) !== Number(this.props.gameWeek) ? 'disabled' : ''
    let losingScore = game.losing_score !== null ? game.losing_score : ''
    let winningScore = game.winning_score !== null ? game.winning_score : ''
    let homeTeamScoreInput = game.losing_score === null && this.props.parentProps.admin === true ? <input name='home_team_score' type='number' min='0' max='100' /> : ''
    let awayTeamScoreInput = game.losing_score === null && this.props.parentProps.admin === true ? <input name='away_team_score' type='number' min='0' max='100' /> : ''
    let adminFormSubmit = game.losing_score === null && this.props.parentProps.admin === true ? <button id={`button${game.id}`} className='adminSubmit' type='submit' value='Submit'>Submit &gt;&gt;</button> : ''
    let awayTeamScore = game.away_team === game.winning_team && game.winning_team !== null ? winningScore : losingScore
    let homeTeamScore = game.home_team === game.winning_team && game.winning_team !== null ? winningScore : losingScore
    let awayTeamResult = game.away_team === game.winning_team && game.winning_team !== null ? 'winner' : 'false'
    let homeTeamResult = game.home_team === game.winning_team && game.winning_team !== null ? 'winner' : 'false'
    let awayTeamImg = awayTeam.toLowerCase().replace(replaceSpace, '')
    let homeTeamImg = homeTeam.toLowerCase().replace(replaceSpace, '')
    let awayTeamInput = game.game_week === game.requested_week && game.winning_team === null && this.props.parentProps.picks === false ? <input type='radio' name={game.id} value={awayTeam} disabled={disabled} onChange={() => this.removeGameFromSelectedGames(game.id)} /> : ''
    let homeTeamInput = game.game_week === game.requested_week && game.winning_team === null && this.props.parentProps.picks === false ? <input type='radio' name={game.id} value={homeTeam} disabled={disabled} onChange={() => this.removeGameFromSelectedGames(game.id)} /> : ''
    let gameTime = this.fixGameTime(game.game_time)

    return <div className={`game ${divisionGame}`} key={game.id} id={`game_${game.id}`} >
      {weekHeader}
      {dayAndDateHeader}
      <label className='away'>
        {awayTeamInput}
        <img id={game.id} className={`${authorized} ${awayTeamResult} ${past}`} src={`assets/img/${awayTeamImg}.png`} alt={awayTeam} /><br />
        <div className='teamName'><Link to={`/teams/${awayTeam}`}>{game.away_team}</Link></div>
        <div className={`score ${awayTeamResult}`}>{awayTeamScore}{awayTeamScoreInput}</div>
      </label>
      <b>@</b>
      <label className='home'>
        {homeTeamInput}
        <img id={game.id} className={`${authorized} ${homeTeamResult} ${past}`} src={`assets/img/${homeTeamImg}.png`} alt={homeTeam} /><br />
        <div className='teamName'><Link to={`/teams/${homeTeam}`}>{homeTeam}</Link></div>
        <div className={`score ${homeTeamResult}`}>{homeTeamScore}{homeTeamScoreInput}</div>
      </label>
      <div className='locationTime'>{game.game_location} -  EST {gameTime}{adminFormSubmit}</div>
    </div>
  }

}

Game.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Game
