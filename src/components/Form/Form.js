import React from 'react';

import './Form.css';

const form = ( props ) => (
    <form style={{marginTop: props.margin_top}} className={props.className}>
        {props.children}
    </form>
);

export default form;