import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import Teams from '../src/pages/Teams';
import {Link} from 'react-router'

describe ('<Teams />', () => {
  it ('should render 1 div', () => {
    const wrapper = shallow(<Teams />);
    expect(wrapper.find('div')).to.have.length(1);
  })

  it ('should render 32 p tags', () => {
    const wrapper = shallow(<Teams />);
    wrapper.setState({ teams: ["Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills","Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns","Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs","Los Angeles Rams","Miami Dolphins","Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants","New York Jets","Oakland Raiders","Philadelphia Eagles","Pittsburgh Steelers","San Diego Chargers","San Francisco 49ers","Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Redskins"] })
    expect(wrapper.find('p')).to.have.length(32);
  })

  it ('should render 32 <Link /> components', () => {
    const wrapper = shallow(<Teams />);
    wrapper.setState({ teams: ["Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills","Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns","Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs","Los Angeles Rams","Miami Dolphins","Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants","New York Jets","Oakland Raiders","Philadelphia Eagles","Pittsburgh Steelers","San Diego Chargers","San Francisco 49ers","Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Redskins"] })
    expect(wrapper.find(Link)).to.have.length(32);
  })
})
