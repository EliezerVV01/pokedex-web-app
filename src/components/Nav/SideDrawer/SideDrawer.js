import React from 'react'
import './SideDrawer.css'
import NavigationItems from './../NavItems/NavItems'
import Logo from './../../Logo/Logo'
import Backdrop from '../../UI/Backdrop/Backdrop.js'
import Auxi from './../../../hoc/Auxi';

const sideDrawer = (props) => {

    let classes=props.open?"SideDrawer Open":" SideDrawer Close"

    return (
        <Auxi>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={classes} onClick={props.closed}>
                <Logo></Logo>
                <nav>
                    <NavigationItems></NavigationItems>
                </nav>
            </div>
        </Auxi>
    )
}

export default sideDrawer;