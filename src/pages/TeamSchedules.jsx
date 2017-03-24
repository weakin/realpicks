import React from 'react'
import ajax from 'superagent'

import Game from './Game'

class TeamSchedules extends React.Component {
  constructor (props) {
    super(props)

    this.state = { schedule: [], team: '', viewedTeams: [], viewedTeamObjects: {} }
    this.fetchTeamInfo = this.fetchTeamInfo.bind(this)
    this.addHashchangeListener = this.addHashchangeListener.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
  }

  componentDidMount () {
    this.fetchTeamInfo(this.props.params.team)
    this.addHashchangeListener()
  }

  componentDidUpdate () {
    this.scrollToTop()
  }

  /*
  ** The addHashchangeListener function works on the same idea in each component it's placed in.
  ** It listens for changes to location.hash and updates the component state accordingly. If a user is navigating 
  ** within the component, each time a new data request comes back from the server (for GameWeek, Picks, Rankings, 
  ** or TeamSchedules) it pushs the relevant data into a object on the component state and records that that data 
  ** has been requested. While still in the component if the user navigates away and then requests data that has
  ** already been viewed, the addHashchangeListener sees that the data is already on the data storage object state
  ** and calls setState with the correct data. This prevents multiple API requests for the same data. 
  ** If the data hasn't been requested yet, it calls the function that fetches it.
  */
  addHashchangeListener () {
    window.addEventListener('hashchange', function (e) {
      let teamNameRegEx = /teams\/([\w|\s]+)\W/
      let foundTeamNameRegExGroup = document.URL.match(teamNameRegEx)
      let foundTeamName = foundTeamNameRegExGroup !== null ? String(foundTeamNameRegExGroup[1]) : null
      if (foundTeamName === null) { return }
      if (this.state.viewedTeamObjects.hasOwnProperty(foundTeamName) === true) {
        this.setState(this.state.viewedTeamObjects[foundTeamName])
      } else if (this.state.viewedTeamObjects.hasOwnProperty(foundTeamName) !== true && this.state.viewedTeams.indexOf(foundTeamName) === -1) {
        this.fetchTeamInfo(foundTeamName)
      }
    }.bind(this))
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
    $('html,body').animate({scrollTop: 0}, 1000)
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
