import React from 'react';
import Footer from './Footer';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Footer></Footer>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});