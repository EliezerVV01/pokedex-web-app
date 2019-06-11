import React from 'react';
import NotFoundPage from './NotFoundPage';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<NotFoundPage></NotFoundPage>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});