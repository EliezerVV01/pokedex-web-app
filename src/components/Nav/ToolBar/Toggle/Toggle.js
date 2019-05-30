import React from 'react';
import './Toggle.css';

const toggle = ( props ) => (
    <div className="Toggle" onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default toggle;