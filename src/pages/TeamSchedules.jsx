import React from 'react'
import ajax from 'superagent'

import Game from './Game'
import scrollToTop from '../assets/js/scrollToTop'

class TeamSchedules extends React.Component {
  constructor (props) {
    super(props)

    this.state = { schedule: [], team: '', viewedTeams: [], viewedTeamObjects: {} }
    this.fetchTeamInfo = this.fetchTeamInfo.bind(this)
    this.hashChangeListener = this.hashChangeListener.bind(this)
  }

  componentDidMount () {
    this.fetchTeamInfo(this.props.params.team)
    window.addEventListener('hashchange', this.hashChangeListener, false)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.hashChangeListener, false)
  }

  /*
  ** The hashChangeListener function works on the same idea in each component it's placed in.
  ** It listens for changes to location.hash and updates the component state accordingly. On initial load of the
  ** component, the componentDidMount calls the data fetching function. If a user is navigating
  ** within the component, each time a new data request comes back from the server it pushes the relevant
  ** data into a object on the component state that stores the data, and then updates an array on the
  ** component state that records that that specific data has been requested, and is in the data storage object.
  ** While still in the same component if the user requests data that has already been viewed,
  ** the hashChangeListener sees that the data is already on the data storage object on state
  ** and calls setState with the correct data. This prevents multiple API requests for the same data.
  ** If the data hasn't been requested yet, it calls the data fetching function.
  **
  ** As this function is found in four components (GameWeek, Picks, Rankings, and TeamSchedule) with just slight
  ** variations, it should be abstracted and moved up to the top level component. For now though, for each component
  ** the function is in it gets bound to the window by window.addEventListener when the component mounts and
  ** unbound when the component unmounts. If the window event listener wasn't removed when the component unmounted
  ** there could be four event listerners calling the same function each time the location.hash changed.
  */
  hashChangeListener () {
    let teamNameRegEx = /teams\/([\w+|\x25|\s]+)\W/
    let urlSpaceEncodingRegEx = /\x25\d{2}/g
    let foundTeamNameRegExGroup = document.URL.match(teamNameRegEx)
    let foundTeamName = foundTeamNameRegExGroup !== null ? String(foundTeamNameRegExGroup[1]) : null
    if (foundTeamName === null) { return }
    let cleanedTeamName =  foundTeamName.replace(urlSpaceEncodingRegEx, ' ')
    if (this.state.viewedTeamObjects.hasOwnProperty(cleanedTeamName) === true) {
      this.setState(this.state.viewedTeamObjects[cleanedTeamName])
    } else if (this.state.viewedTeamObjects.hasOwnProperty(cleanedTeamName) !== true && this.state.viewedTeams.indexOf(cleanedTeamName) === -1) {
      this.fetchTeamInfo(cleanedTeamName)
    }
    scrollToTop()
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
