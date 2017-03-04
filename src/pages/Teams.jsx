import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

class Teams extends React.Component {
  constructor (props) {
    super(props)

    this.state = { teams: [] }

    this.fetchTeamsInfo = this.fetchTeamsInfo.bind(this)
    this.showTeams = this.showTeams.bind(this)
  }

  componentWillMount () {
    this.fetchTeamsInfo()
  }

  fetchTeamsInfo () {
    let baseURL = 'assets/php/get_teams.php'
    ajax.get(`${baseURL}`)
      .end((error, response) => {
        if (!error && response) {
          this.setState({ teams: response.body })
        } else {
          console.log('There was an error fetching data', error)
        }
      }
    )
  }

  showTeams () {
    return this.state.teams.map((team, index) => {
      return (
        <p key={index} className='teamName'>
          <Link to={`/teams/${team}`}>{team}</Link>
        </p>
      )
    })
  }

  render () {
    let content
    content = this.showTeams()
    return <div className='teams'>{content}</div>
  }
}

export default Teams
