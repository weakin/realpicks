import React from 'react';
import {Link} from 'react-router'
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import GameWeek from '../src/pages/GameWeek';
import Game from '../src/pages/Game';
import Header from '../src/pages/Header';

describe ('<GameWeek />', () => {
  it ('should render 1 div', () => {
    const wrapper = shallow(<GameWeek />);
    expect(wrapper.find('div')).to.have.length(1);
  })

  it ('should render 1 <Header /> component', () => {
    const wrapper = shallow(<GameWeek />);
    expect(wrapper.find(Header)).to.have.length(1);
  })

  it ('should render 1 <Game /> component', () => {
    const wrapper = shallow(<GameWeek />);
    expect(wrapper.find(Game)).to.have.length(1);
  })

  it ('if state.back and state.forward are undefined, no <Link /> component should be rendered into a span', () => {
    const wrapper = shallow(<GameWeek />);
    expect(wrapper.find(Link)).to.have.length(0);
  })

  it ('if state.back is defined and in range, one <Link /> component should be rendered into a span.back', () => {
    const wrapper = shallow(<GameWeek />);
    wrapper.setState({ back: 1 });
    expect(wrapper.find('.back').childAt(0).type()).to.equal(Link);
  })

  it ('if state.forward is defined and in range, one <Link /> component should be rendered into a span.forward', () => {
    const wrapper = shallow(<GameWeek />);
    wrapper.setState({ forward: 10 });
    expect(wrapper.find('.forward').childAt(0).type()).to.equal(Link);
  })

  it ('if state.back and state.forward are defined and in range, two <Link /> components should be rendered', () => {
    const wrapper = shallow(<GameWeek />);
    wrapper.setState({ back: 1, forward: 10 });
    expect(wrapper.find(Link)).to.have.length(2);
  })

})
