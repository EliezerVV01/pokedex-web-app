import React from 'react';
import Input from './Input';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Input  invalid={true}
    touched={true}
    value={'Eating'}
    changed={()=>alert('It changed')}></Input>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});