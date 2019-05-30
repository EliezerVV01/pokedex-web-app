import React from 'react';

import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import * as links from './../RoutesList';
import Auxi from './../../hoc/Auxi';


const privateRoute = ( props ) => {
    let response = <Route {...props}/>;
    if(props.redirect===true){
        response= <Redirect to={links.LOGIN}/>
    }
    return (
<Auxi> {response}</Auxi>
       
    );
};

export default privateRoute;