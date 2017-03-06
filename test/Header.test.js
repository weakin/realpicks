import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import {Link} from 'react-router'
import Header from '../src/pages/Header';

describe ('<Header />', () => {
  it ('should render a div', () => {
    const wrapper = shallow(<Header />); 
    expect(wrapper.find('div')).to.have.length(1);
  });

  it ('if caller is gameWeek, it should render the text passed in', () => {
    const wrapper = shallow(<Header caller='gameWeek' class="weekHeader" text="Week 5" />);
    expect(wrapper.text()).to.equal('Week 5');
  });

  it ('if caller is gameWeek, it should not render a <Link /> component', () => {
    const wrapper = shallow(<Header caller='gameWeek' class="weekHeader" text="Week 5" />);
    expect(wrapper.find(Link)).to.have.length(0);
  });

  it ('if caller is undefined, it should render 1 <Link /> component', () => {
    const wrapper = shallow(<Header />); 
    expect(wrapper.find(Link)).to.have.length(1);
  });
});
