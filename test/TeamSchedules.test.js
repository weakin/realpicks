import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import TeamSchedules from '../src/pages/TeamSchedules';
import Game from '../src/pages/Game';
import {Link} from 'react-router'

describe ('<TeamSchedules />', () => {
  it ('should render 1 div', () => {
    const wrapper = shallow(<TeamSchedules />);
    expect(wrapper.find('div')).to.have.length(1);
  })

  it ('should render 1 <Game /> component', () => {
    const wrapper = shallow(<TeamSchedules />);
    expect(wrapper.find(Game)).to.have.length(1);
  })
})
