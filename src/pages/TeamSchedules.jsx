import React from 'react'
import ajax from 'superagent'

import Game from './Game'

class TeamSchedules extends React.Component {
  constructor (props) {
    super(props)

    this.state = { schedule: [], team: '', viewedTeams: [], viewedTeamObjects: {} }

    this.fetchTeamInfo = this.fetchTeamInfo.bind(this)

    this.addWindowListener = this.addWindowListener.bind(this)

    this.scrollToTop = this.scrollToTop.bind(this)
  }

  componentDidMount () {
    this.fetchTeamInfo(this.props.params.team)
    this.addWindowListener()
  }

  componentDidUpdate () {
    if (this.props.params.team !== this.state.team) {
      this.state.team = this.props.params.team
      this.fetchTeamInfo(this.props.params.team)
    }
  }

  addWindowListener () {
    let viewedTeams = this.state.viewedTeams
    let viewedTeamObjects = this.state.viewedTeamObjects
    let thisHack = this
    window.addEventListener('popstate', function (e) {
      let teamNameRegEx = /teams\/([\w|\s]+)\W/
      let foundTeamName = document.URL.match(teamNameRegEx)
      if (viewedTeamObjects.hasOwnProperty(foundTeamName[1]) === true) {
        thisHack.setState(viewedTeamObjects[foundTeamName])
      } else {
        viewedTeams.push(foundTeamName[1])
      }
      thisHack.scrollToTop()
    })
  }

  fetchTeamInfo (team) {
    let baseURL = 'assets/php/team_schedule_query.php?team='
    let teamName = team.trim()
    let teamScheduleObj = {}
    ajax.get(`${baseURL}${teamName}`)
      .end((error, response) => {
        if (!error && response) {
          if (this.state.viewedTeams.indexOf(teamName) === -1) {
            this.state.viewedTeams.push(teamName)
          }
          teamScheduleObj = { schedule: response.body, team: teamName }
          this.state.viewedTeamObjects[teamName] = teamScheduleObj
          this.setState(teamScheduleObj)
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
    return (
      <div className='teamSchedule'>
        <Game caller='teamSchedule' team={this.state.team} games={this.state.schedule} gameWeek={this.state.game_week} parentProps={this.props} />
      </div>
    )
  }
}

export default TeamSchedules
