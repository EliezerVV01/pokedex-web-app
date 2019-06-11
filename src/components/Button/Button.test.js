import React from 'react';
import Button from './Button';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Button 
        disabled 
        className="btn btn-success" 
        onClick={()=>alert('Cool!')}
        style={{margin: 'auto'}}>Save</Button>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});