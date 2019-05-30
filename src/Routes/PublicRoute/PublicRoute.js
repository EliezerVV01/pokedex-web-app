import React from 'react';

import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import * as links from '../RoutesList';
import Aux from '../../hoc/Auxi';


const publicRoute = ( props ) => {
    let response = <Route {...props}/>;
    if(props.redirect===true){
        response= <Redirect to={links.HOME}/>
    }
    return (
<Aux> {response}</Aux>
       
    );
};

export default publicRoute;