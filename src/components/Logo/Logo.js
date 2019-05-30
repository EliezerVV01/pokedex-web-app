import React from 'react';
import { NavLink } from 'react-router-dom';
import DesktopLogoImage from '../../Assets/Images/pokedex_desktop_logo.png';
import './Logo.css';


const logo = (props) => {
    let logo=( <NavLink to="/" exact>
    <img alt="logo"
        src={DesktopLogoImage}
        className="LogoLink" />
</NavLink>);
    if(!props.link){
        logo = ( <img alt="logo"
        src={DesktopLogoImage}
        className="LogoLink" />);
    }
    return (
        <div style={{ height: props.height }} className="Logo">
            {logo}
        </div>

    )
};


export default logo;