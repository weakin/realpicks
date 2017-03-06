import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import Picks from '../src/pages/Picks';
import Pick from '../src/pages/Pick';
import {Link} from 'react-router'

describe ('<Picks />', () => {
  let picksStub = {
    "224": {
      "game": {
        "id": "224",
        "home_team": "New York Jets",
        "away_team": "Indianapolis Colts",
        "winning_team": "Indianapolis Colts",
        "losing_team": "New York Jets",
        "winning_score": "41",
        "losing_score": "10",
        "game_day_of_week": "Monday",
        "game_date": "2016-12-05",
        "pick": "Indianapolis Colts",
        "user_name": "eric",
        "game_week_alias": "Week 13"
      },
      "isaiah": {
        "pick": "Indianapolis Colts",
        "id": "224"
      },
      "taylor": {
        "pick": "Indianapolis Colts",
        "id": "224"
      },
      "william": {
        "pick": "New York Jets",
        "id": "224"
      },
      "eric": {
        "pick": "Indianapolis Colts",
        "id": "224"
      }
    },
    "223": {
      "game": {
        "id": "223",
        "home_team": "Seattle Seahawks",
        "away_team": "Carolina Panthers",
        "winning_team": "Seattle Seahawks",
        "losing_team": "Carolina Panthers",
        "winning_score": "40",
        "losing_score": "7",
        "game_day_of_week": "Sunday",
        "game_date": "2016-12-04",
        "pick": "Seattle Seahawks",
        "user_name": "taylor",
        "game_week_alias": "Week 13"
      },
      "eric": {
        "pick": "Seattle Seahawks",
        "id": "223"
      },
      "william": {
        "pick": "Seattle Seahawks",
        "id": "223"
      },
      "isaiah": {
        "pick": "Seattle Seahawks",
        "id": "223"
      },
      "taylor": {
        "pick": "Seattle Seahawks",
        "id": "223"
      }
    },
    "222": {
      "game": {
        "id": "222",
        "home_team": "San Diego Chargers",
        "away_team": "Tampa Bay Buccaneers",
        "winning_team": "Tampa Bay Buccaneers",
        "losing_team": "San Diego Chargers",
        "winning_score": "28",
        "losing_score": "21",
        "game_day_of_week": "Sunday",
        "game_date": "2016-12-04",
        "pick": "San Diego Chargers",
        "user_name": "isaiah",
        "game_week_alias": "Week 13"
      },
      "taylor": {
        "pick": "San Diego Chargers",
        "id": "222"
      },
      "eric": {
        "pick": "San Diego Chargers",
        "id": "222"
      },
      "william": {
        "pick": "Tampa Bay Buccaneers",
        "id": "222"
      },
      "isaiah": {
        "pick": "San Diego Chargers",
        "id": "222"
      }
    },
    "220": {
      "game": {
        "id": "220",
        "home_team": "Arizona Cardinals",
        "away_team": "Washington Redskins",
        "winning_team": "Arizona Cardinals",
        "losing_team": "Washington Redskins",
        "winning_score": "31",
        "losing_score": "23",
        "game_day_of_week": "Sunday",
        "game_date": "2016-12-04",
        "pick": "Arizona Cardinals",
        "user_name": "eric",
        "game_week_alias": "Week 13"
      },
      "isaiah": {
        "pick": "Arizona Cardinals",
        "id": "220"
      },
      "william": {
        "pick": "Washington Redskins",
        "id": "220"
      },
      "taylor": {
        "pick": "Washington Redskins",
        "id": "220"
      },
      "eric": {
        "pick": "Arizona Cardinals",
        "id": "220"
      }
    }
  };
  
  let withPickStub = Object.keys(picksStub).length + 1;  

  it ('if no user has made picks, render 2 divs', () => {
    const wrapper = shallow(<Picks />);
    expect(wrapper.find('div')).to.have.length(2);
  })

  it ('without pickStub, should render 1 <Pick /> component', () => {
    const wrapper = shallow(<Picks />);
    expect(wrapper.find(Pick)).to.have.length(1);
  })

  it ('with pickStub, should render ' + withPickStub + ' <Pick /> components', () => {
    const wrapper = shallow(<Picks />);
    wrapper.setState({ picks: picksStub })
    expect(wrapper.find(Pick)).to.have.length(withPickStub);
  })
/*  
  it ('authorized user should render 5 <Link /> components', () => {
    const wrapper = shallow(<Picks authorized={true} />);
    expect(wrapper.find(Link)).to.have.length(5);
  })

  it ('non-authorized user should render 3 li', () => {
    const wrapper = shallow(<Picks />);
    expect(wrapper.find('li')).to.have.length(3);
  })

  it ('non-authorized user should render 3 <Link /> components', () => {
    const wrapper = shallow(<Picks />);
    expect(wrapper.find(Link)).to.have.length(3);
  })

  */
})
