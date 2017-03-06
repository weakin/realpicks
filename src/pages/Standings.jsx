import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

class Standings extends React.Component {
  constructor (props) {
    super(props)

    this.state = { standings: [], sortColumn: '', sortOrder: '', conferences: [], division: [] }

    this.fetchStandings = this.fetchStandings.bind(this)

    this.resetStandings = this.resetStandings.bind(this)

    this.doSort = this.doSort.bind(this)
  }

  componentDidMount () {
    this.fetchStandings()
  }

  fetchStandings (column = '', order = '') {
    let baseURL = 'assets/php/team_standings_query.php'
    let sortParams = '?column=' + column + '&order=' + order
    ajax.get(`${baseURL}${sortParams}`)
      .end((error, response) => {
        if (!error && response) {
          this.setState({ standings: this.setInitialStandings(response.body) })
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  setInitialStandings (responseBody) {
    let standingsHolder = []
    responseBody.map(function (game) {
      if (this.state.division.indexOf(game.team_division.trim()) === -1) {
        this.state.division.push(game.team_division.trim())
        standingsHolder.push(game.team_division.trim())
        standingsHolder.push(game)
        return
      }
      standingsHolder.push(game)
      return
    }, this)
    return standingsHolder
  }

  resetStandings () {
    this.setState({sortColumn: '', sortOrder: ''})
    this.fetchStandings()
  }

  doSort (column) {
    let order = 'DESC'
    if (this.state.sortOrder === order && this.state.sortColumn === column) {
      order = 'ASC'
    }
    this.setState({sortColumn: column, sortOrder: order})
    this.fetchStandings(column, order)
  }

  tableHeaderRow () {
    return <tr className='headerRow'>
      <td className='teamName'>
        <Link to={'/standings'} onClick={() => this.resetStandings()}>Team</Link>
      </td>
      <td className='record'>
        <Link to={'/standings'} onClick={() => this.doSort('wins')}>Record</Link>
      </td>
      <td className='homeRecord'>
        <Link to={'/standings'} onClick={() => this.doSort('home_wins')}>Home</Link>
      </td>
      <td className='awayRecord'>
        <Link to={'/standings'} onClick={() => this.doSort('away_wins')}>Away</Link>
      </td>
      <td className='divisionRecord'>
        <Link to={'/standings'} onClick={() => this.doSort('division_wins')}>Division</Link>
      </td>
      <td className='streak'>
        <Link to={'/standings'} onClick={() => this.doSort('streak')}>Streak</Link>
      </td>
      <td className='total_points'>
        <Link to={'/standings'} onClick={() => this.doSort('total_points_scored')}>Total Points</Link>
      </td>
      <td className='total_points_surr'>
        <Link to={'/standings'} onClick={() => this.doSort('total_points_surrendered')}>Total Given Up</Link>
      </td>
      <td className='average_points'>
        <Link to={'/standings'} onClick={() => this.doSort('average_points_scored_per_game')}>Average PPG</Link>
      </td>
      <td className='average_points_surr'>
        <Link to={'/standings'} onClick={() => this.doSort('average_points_surrendered_per_game')}>Average PGUPG</Link>
      </td>
    </tr>
  }

  clearStateDivisionArray () {
    if (this.state.sortColumn === '') {
      this.state.division.splice(0)
      return ''
    } else {
      return ''
    }
  }

  renderTeamStandings (team) {
    if (typeof team === 'string') {
      if (this.state.division.indexOf(team) === -1) {
        this.state.division.push(team.trim())
      }
      return <tr key={team} className='divisionHeaderRow'><td colSpan={10}>{team}</td></tr>
    } else {
      let teamName = team.team_name.trim()
      let ties = team.ties !== '0' ? ' - ' + team.ties : ''
      return (
        <tr key={teamName} className='teamRow'>
          <td className='teamName'>
            <Link to={`/teams/${teamName}`}>{teamName}</Link>
          </td>
          <td className={`wins1 ${this.state.sortColumn}`}>{team.wins} - {team.losses}{ties}</td>
          <td className={`home_wins1 ${this.state.sortColumn}`}>{team.home_wins} - {team.home_losses}</td>
          <td className={`away_wins1 ${this.state.sortColumn}`}>{team.away_wins} - {team.away_losses}</td>
          <td className={`division_wins1 ${this.state.sortColumn}`}>{team.division_wins} - {team.division_losses}</td>
          <td className={`streak1 ${this.state.sortColumn}`}>{team.streak_type} {team.streak}</td>
          <td className={`total_points_scored1 ${this.state.sortColumn}`}>{team.total_points_scored}</td>
          <td className={`total_points_surrendered1 ${this.state.sortColumn}`}>{team.total_points_surrendered}</td>
          <td className={`average_points_scored_per_game1 ${this.state.sortColumn}`}>{team.average_points_scored_per_game}</td>
          <td className={`average_points_surrendered_per_game1 ${this.state.sortColumn}`}>{team.average_points_surrendered_per_game}</td>
        </tr>
      )
    }
  }

  render () {
    let tableClass = this.state.sortColumn !== '' && this.state.sortOrder !== '' ? 'standings stripe' : 'standings'
    return <table className={tableClass}>
      {this.tableHeaderRow()}
      {this.clearStateDivisionArray()}
      {this.state.standings.map(this.renderTeamStandings, this)}
    </table>
  }

}

export default Standings
