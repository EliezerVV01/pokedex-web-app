import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as links from './../../../Routes/RoutesList';


import './NavItems.css';
import NavigationItem from './NavItem/NavItem';

const navigationItems = (props) => (
    <ul className='NavigationItems'>
        <NavigationItem link={links.PROFILE} exact><FontAwesomeIcon 
                                                icon="user" />  Name 
        </NavigationItem>
        <NavigationItem link={links.LOGOUT}> <FontAwesomeIcon 
                                                icon="sign-out-alt" />
        </NavigationItem>
    </ul>
);

export default navigationItems;