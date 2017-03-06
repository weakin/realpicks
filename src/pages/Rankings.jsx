import React from 'react'
import ajax from 'superagent'
import {Link} from 'react-router'

class Rankings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {week: {}, total: {}, currentWeek: 0, requestedWeek: 0, gameWeekAlias: '', rankings: {}, viewedRankings: [], viewedRankingsObjects: []}

    this.fetchRankingsInfo = this.fetchRankingsInfo.bind(this)
    this.addWindowListener = this.addWindowListener.bind(this)
    this.buildRankingRowNav = this.buildRankingRowNav.bind(this)
  }

  componentDidMount () {
    this.fetchRankingsInfo(this.props.params.week)
    this.addWindowListener()
  }

  addWindowListener () {
    let viewedRankings = this.state.viewedRankings
    let viewedRankingsObjects = this.state.viewedRankingsObjects
    let thisHack = this
    window.addEventListener('popstate', function (e) {
      let rankingRegEx = /rankings\/(\d{1,2})/
      let foundRankingWeek = document.URL.match(rankingRegEx)
      let foundRankingWeekInt = foundRankingWeek !== null ? Number(foundRankingWeek[1]) : null
      if (viewedRankings.indexOf(foundRankingWeekInt) > -1) {
        thisHack.setState(viewedRankingsObjects[foundRankingWeekInt])
      } else if (foundRankingWeekInt === null) {
        thisHack.setState(viewedRankingsObjects[viewedRankings[0]])
      }
    })
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

          rankingsObject = {week: response.body.week, total: response.body.total, requestedWeek: response.body.requested_week, gameWeekAlias: response.body.game_week_alias, currentWeek: response.body.current_week}
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
    let backInt = Number(requestedWeekArg) - 1
    let forwardInt = Number(requestedWeekArg) + 1
    backArrow = requestedWeek <= currentWeek && currentWeek >= 2 && requestedWeek >= 2 ? <Link to={`/rankings/${Number(requestedWeek) - 1}`} onClick={() => this.fetchRankingsInfo(backInt)}>&lt;&lt;</Link> : <span className='hide'>&lt;&lt;</span>
    forwardArrow = currentWeek <= 21 && requestedWeek < currentWeek ? <Link to={`/rankings/${Number(requestedWeek) + 1}`} onClick={() => this.fetchRankingsInfo(forwardInt)}>&gt;&gt;</Link> : <span className='hide'>&gt;&gt;</span>
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
    })}</div><div className='weekWrapper'><span className='weekHeader'>{this.buildRankingRowNav(1, this.state.requestedWeek, this.state.currentWeek, this.state.gameWeekAlias)}</span>{week.map((el) => {
      return el
    })}</div></p>
  }
}

export default Rankings
