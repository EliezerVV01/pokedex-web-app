import React from 'react';
import Form from './Form';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Form  margin_top="85%" className="input"></Form>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});