import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

class Rankings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {week: {}, total: {}, current_week: 0, requestedWeek: 0, gameWeekAlias: '', rankings: {}, viewedRankings: [], viewedRankingsObjects: []}

    this.fetchRankingsInfo = this.fetchRankingsInfo.bind(this)
    this.hashChangeListener = this.hashChangeListener.bind(this)
    this.buildRankingRowNav = this.buildRankingRowNav.bind(this)
  }

  componentDidMount () {
    this.fetchRankingsInfo(this.props.params.week)
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
    let rankingRegEx = /rankings\/(\d{1,2})/
    let foundRankingWeek = document.URL.match(rankingRegEx)
    let foundRankingWeekInt = foundRankingWeek !== null ? Number(foundRankingWeek[1]) : null
    if (this.state.viewedRankings.indexOf(foundRankingWeekInt) === -1 && foundRankingWeekInt !== null && this.state.current_week !== (foundRankingWeekInt + 1)) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is not one less than the current week int
      this.fetchRankingsInfo(foundRankingWeekInt)
    } else if (this.state.viewedRankings.indexOf(foundRankingWeekInt) === -1 && foundRankingWeekInt !== null && (this.state.current_week - 1) === foundRankingWeekInt) {
      // the requested data has not been viewed, there is an integer from location.hash, and that int is one less than the current week int
      this.fetchRankingsInfo(foundRankingWeekInt)
    } else if (this.state.viewedRankings.indexOf(this.state.current_week) === -1 && foundRankingWeekInt === null && this.state.viewedRankings.length > 0) {
      // this is an edge case where the user loaded the component with the initial state of the current week, views other weeks, then navigates away to
      // another component, and then uses the browser back button to get back to the page of the initial component state.
      // the requested data has not been viewed, there is no integer from location.hash, and as there are no other weeks in memory, display the current week
      this.fetchRankingsInfo(this.state.current_week)
    } else if (this.state.viewedRankings.indexOf(this.state.current_week) > -1 && foundRankingWeekInt === null) {
      // the requested data has already been viewed, is the current week, and there is no week integer coming in from location.hash, so update the state from the stored data
      this.setState(this.state.viewedRankingsObjects[this.state.current_week])
    } else if (this.state.viewedRankings.indexOf(foundRankingWeekInt) > -1) {
      // the requested data has already been viewed and is stored, so update the state from the stored data
      this.setState(this.state.viewedRankingsObjects[foundRankingWeekInt])
    }
  }

  fetchRankingsInfo (weekInt) {
    let week = 0
    let rankingsObject = {}
    let baseURL = 'assets/php/show_user_stats.php'
    if (weekInt !== undefined) {
      week = Number(weekInt)
    }
    ajax.get(`${baseURL}?week=${week}&group=${this.props.group}`)
      .end((error, response) => {
        if (!error && response) {
          let rankingsWeekInt = Number(response.body.requested_week)
          if (this.state.viewedRankings.indexOf(rankingsWeekInt) === -1) {
            this.state.viewedRankings.push(rankingsWeekInt)
          }

          rankingsObject = {week: response.body.week, total: response.body.total, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias, current_week: response.body.current_week}
          this.state.viewedRankingsObjects[rankingsWeekInt] = rankingsObject
          this.setState(rankingsObject)
        } else {
          console.log('There was an error fetching data - ', error)
        }
      }
    )
  }

  buildRankingRowNav (key, requestedWeekArg, currentWeekArg, gameWeekAliasArg) {
    let backArrow = ''
    let forwardArrow = ''
    let requestedWeek = Number(requestedWeekArg)
    let currentWeek = Number(currentWeekArg)
    backArrow = requestedWeek <= currentWeek && currentWeek >= 2 && requestedWeek >= 2 ? <Link to={`/rankings/${Number(requestedWeek) - 1}`} >&lt;&lt;</Link> : <span className='hide'>&lt;&lt;</span>
    forwardArrow = currentWeek <= 21 && requestedWeek < currentWeek ? <Link to={`/rankings/${Number(requestedWeek) + 1}`}>&gt;&gt;</Link> : <span className='hide'>&gt;&gt;</span>
    return <span className='header' key={key}>{backArrow} {gameWeekAliasArg} {forwardArrow}</span>
  }

  render () {
    let total = []
    let week = []
    if (this.state.total !== undefined) {
      for (var rank in this.state.total) {
        total.push(<div className='total'><span className='name'>{rank} : </span><span className='score'>{this.state.total[rank]}</span></div>)
      }
    }
    if (this.state.week !== undefined) {
      for (var rank2 in this.state.week) {
        week.push(<div className='week'><span className='name'>{rank2} : </span><span className='score'>{this.state.week[rank2]}</span></div>)
      }
    }
    return <p className='rankings'><div className='totalWrapper'><span className='totalHeader'>Total:</span>{total.map((el) => {
      return el
    })}</div><div className='weekWrapper'><span className='weekHeader'>{this.buildRankingRowNav(1, this.state.requestedWeek, this.state.current_week, this.state.gameWeekAlias)}</span>{week.map((el) => {
      return el
    })}</div></p>
  }
}

export default Rankings
