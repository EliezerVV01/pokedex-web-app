import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as links from './../../../Routes/RoutesList';
import './NavItems.css';
import NavigationItem from './NavItem/NavItem';
import { connect } from 'react-redux';

const navigationItems = (props) => { 
    return (
    <ul className='NavigationItems'>
        <NavigationItem link={links.PROFILE} exact> <FontAwesomeIcon 
                                                icon="user" /> Profile  
        </NavigationItem>
        <NavigationItem link={links.LOGOUT}> <FontAwesomeIcon 
                                                icon="sign-out-alt" />
                                               
        </NavigationItem>
    </ul>
)
    };


const mapStatesToProps = states => {
    return {
        email: states.userEmail
    }
}    

export default connect(mapStatesToProps)(navigationItems);