import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import Pick from '../src/pages/Pick';
import {Link} from 'react-router'

describe ('<Pick />', () => {
  let propsObjHeader = {
    caller: 'header',
    headerArray: ['game','eric','isaiah','taylor','william'],
    currentWeek: '21', 
    requestedWeek: '13',
    gameWeekAlias: 'Week 13'
  };
  
  let propsObjPicksRow = {
    caller: 'picksRow',
    picks: [
      [
        'game',
        {
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
        }
      ],
      [
        'eric',
        'Seattle Seahawks'
      ],
      [
        'isaiah',
        'Seattle Seahawks'
      ],
      [
        'taylor',
        'Seattle Seahawks'
      ],
      [
        'william',
        'Seattle Seahawks'
      ]
    ]
  };

  it ('should render 1 div.headerRow', () => {
    const wrapper = shallow(<Pick {...propsObjHeader} />);
    expect(wrapper.find('div.headerRow')).to.have.length(1);
  })

  it ('div.headerRow number of child elements should equal props.headerArray.length', () => {
    const wrapper = shallow(<Pick {...propsObjHeader} />);
    expect(wrapper.find('div.headerRow').children()).to.have.length(propsObjHeader.headerArray.length);
  })

  it ('should render 1 div.gameRow', () => {
    const wrapper = shallow(<Pick {...propsObjPicksRow}  />);
    expect(wrapper.find('div.gameRow')).to.have.length(1);
  })

  it ('div.gameRow number of child elements should equal props.picks.length', () => {
    const wrapper = shallow(<Pick {...propsObjPicksRow}  />);
    expect(wrapper.find('div.gameRow').children()).to.have.length(propsObjPicksRow.picks.length);
  })

  it ('images in div.gameRow should equal props.picks.length + 1', () => {
    const wrapper = shallow(<Pick {...propsObjPicksRow}  />);
    expect(wrapper.find('img')).to.have.length(propsObjPicksRow.picks.length + 1);
  })
})
