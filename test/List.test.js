import React from 'react';
import { expect } from 'chai';
import  { shallow, mount, render } from 'enzyme';
import List from '../src/pages/List';
import {Link} from 'react-router'

describe ('<List />', () => {
  it ('should render 1 div', () => {
    const wrapper = shallow(<List />);
    expect(wrapper.find('div')).to.have.length(1);
  })

  it ('should render 1 ul', () => {
    const wrapper = shallow(<List />);
    expect(wrapper.find('ul')).to.have.length(1);
  })

  it ('authorized user should render 5 li', () => {
    const wrapper = shallow(<List authorized={true} />);
    expect(wrapper.find('li')).to.have.length(5);
  })
  
  it ('authorized user should render 5 <Link /> components', () => {
    const wrapper = shallow(<List authorized={true} />);
    expect(wrapper.find(Link)).to.have.length(5);
  })

  it ('non-authorized user should render 3 li', () => {
    const wrapper = shallow(<List />);
    expect(wrapper.find('li')).to.have.length(3);
  })

  it ('non-authorized user should render 3 <Link /> components', () => {
    const wrapper = shallow(<List />);
    expect(wrapper.find(Link)).to.have.length(3);
  })

})
