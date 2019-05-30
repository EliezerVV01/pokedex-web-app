import React from 'react';
import './ToolBar.css';
import Logo from './../../Logo/Logo';
import NavigationItems from './../NavItems/NavItems';
import Toggle from './Toggle/Toggle';


const toolbar = ( props ) => (
    <header className="Toolbar">
    <Toggle clicked={props.toggleClicked} />
       <Logo height="80%" link></Logo>
        <nav>
           <NavigationItems ></NavigationItems>
        </nav>
    </header>
);

export default toolbar;