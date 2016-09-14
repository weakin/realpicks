import React from 'react'
import ajax from 'superagent'
import { IndexLink, Link } from 'react-router'

class Teams extends React.Component {
  constructor (props) {
    super(props)

    this.state = { teams: [] }
  }

  componentWillMount () {
    ajax.get('assets/php/get_teams.php')
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
      return (<p key={index} className='teamName'>
                <Link to={`/team/${team}`}>
                {team}
                </Link>
              </p>)
    })
  }

  render () {
    let content
    content = this.showTeams()
    return <div>
             {content}
           </div>
  }
}

export default Teams
